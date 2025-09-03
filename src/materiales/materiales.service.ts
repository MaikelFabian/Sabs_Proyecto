// src/material/services/material.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import { Material } from '../materiales/entities/materiale.entity';
import { Movimiento } from '../movimientos/entities/movimiento.entity';
import { Detalle } from '../detalles/entities/detalle.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Sitio } from '../sitios/entities/sitio.entity';
import { StockService } from '../stock/stock.service';
import { CreateMaterialDto } from '../materiales/dto/create-materiale.dto';
import { UpdateMaterialDto } from '../materiales/dto/update-materiale.dto';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly repo: Repository<Material>,
    @InjectRepository(Movimiento)
    private readonly movimientoRepo: Repository<Movimiento>,
    @InjectRepository(Detalle)
    private readonly detallesRepo: Repository<Detalle>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(Persona)
    private readonly personaRepo: Repository<Persona>,
    @InjectRepository(Sitio)
    private readonly sitioRepo: Repository<Sitio>,
    private readonly stockService: StockService,
  ) {}

  async getMovimientosPorMaterial(materialId: number) {
    return this.movimientoRepo
      .createQueryBuilder('mov')
      .leftJoinAndSelect('mov.detalles', 'detalle')
      .leftJoinAndSelect('mov.tipoMovimiento', 'tipo')
      .leftJoinAndSelect('mov.personaSolicita', 'personaSolicita')
      .leftJoinAndSelect('mov.personaAprueba', 'personaAprueba')
      .leftJoinAndSelect('mov.sitioOrigen', 'sitioOrigen')
      .leftJoinAndSelect('mov.sitioDestino', 'sitioDestino')
      .where('mov.materialId = :materialId', { materialId })
      .orWhere('mov.materialPrestamoId = :materialId', { materialId })
      .orderBy('mov.fechaCreacion', 'DESC')
      .getMany();
  }

  // ==============================
  // CRUD Básico
  // ==============================
  async create(dto: CreateMaterialDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Material creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({
      where: { activo: true },
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'detalles',
        'sitio',
        'registradoPor',
        'stocks',
      ],
    });
    return { message: 'Listado de materiales', data: lista };
  }

  async findOne(id: number) {
    const material = await this.repo.findOne({
      where: { id, activo: true },
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'detalles',
        'sitio',
        'registradoPor',
        'stocks',
      ],
    });
    if (!material)
      throw new NotFoundException(`Material no encontrado id: ${id}`);
    return { message: 'Material encontrado', data: material };
  }

  async update(id: number, dto: UpdateMaterialDto) {
    const { detalles, movimientos, stocks, ...updateData } = dto as any;
    await this.repo.update(id, updateData);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'detalles',
        'sitio',
        'registradoPor',
        'stocks',
      ],
    });
    return { message: 'Material actualizado', data: actualizado };
  }

  // ==============================
  // Stock y Cantidades Prestadas
  // ==============================
  async getTotalActiveStock(
    materialId: number,
    sitioId?: number | null,
  ): Promise<number> {
    const material = await this.repo.findOne({
      where: { id: materialId },
      relations: ['stocks'],
    });
    if (!material)
      throw new NotFoundException(`Material no encontrado id: ${materialId}`);

    return (
      material.stocks
        ?.filter((s) => s.activo && (sitioId == null || s.sitioId === sitioId))
        .reduce((total, s) => total + s.cantidad, 0) || 0
    );
  }

  async validarStockDisponible(
    materialId: number,
    cantidad: number,
    sitioId?: number,
  ) {
    const totalDisponible = await this.getTotalActiveStock(materialId, sitioId);
    if (totalDisponible < cantidad) {
      const material = await this.repo.findOne({ where: { id: materialId } });
      throw new BadRequestException(
        `No hay suficiente stock disponible para ${material?.nombre} (solicitado: ${cantidad}, disponible: ${totalDisponible})`,
      );
    }
  }

  async incrementarCantidadPrestada(materialId: number, cantidad: number) {
    const material = await this.repo.findOne({ where: { id: materialId } });
    if (!material)
      throw new NotFoundException(`Material no encontrado id: ${materialId}`);

    material.cantidadPrestada = (material.cantidadPrestada ?? 0) + cantidad;
    await this.repo.save(material);
  }

  async reducirCantidadPrestada(materialId: number, cantidad: number) {
    const material = await this.repo.findOne({ where: { id: materialId } });
    if (!material)
      throw new NotFoundException(`Material no encontrado id: ${materialId}`);

    material.cantidadPrestada = Math.max(
      (material.cantidadPrestada ?? 0) - cantidad,
      0,
    );
    await this.repo.save(material);
  }

  // ==============================
  // Métodos de Devolución y Préstamo
  // ==============================
  async procesarDevolucionAutomatica(materialPrestado: Material) {
    if (
      !materialPrestado.materialOrigenId ||
      !materialPrestado.cantidadPrestada
    )
      return;

    const materialOrigen = await this.repo.findOne({
      where: { id: materialPrestado.materialOrigenId, activo: true },
    });
    if (!materialOrigen) return;

    await this.incrementarStock(
      materialOrigen.id,
      materialPrestado.cantidadPrestada,
    );

    materialPrestado.cantidadPrestada = 0;
    materialPrestado.activo = false;
    await this.repo.save(materialPrestado);
    await this.desactivarStock(materialPrestado.id);
  }

  async incrementarStock(
    materialId: number,
    cantidad: number,
    sitioId?: number,
  ) {
    let stock = await this.stockRepo.findOne({
      where: { materialId, ...(sitioId ? { sitioId } : {}), activo: true },
    });
    if (stock) {
      stock.cantidad += cantidad;
    } else {
      stock = this.stockRepo.create({
        materialId,
        cantidad,
        activo: true,
        sitioId,
      });
    }
    await this.stockRepo.save(stock);
  }

  async reducirStock(materialId: number, cantidad: number, sitioId?: number) {
    let stock = await this.stockRepo.findOne({
      where: { materialId, ...(sitioId ? { sitioId } : {}), activo: true },
    });
    if (!stock || stock.cantidad < cantidad) {
      throw new BadRequestException(
        'No hay suficiente stock para procesar la operación',
      );
    }
    stock.cantidad -= cantidad;
    await this.stockRepo.save(stock);
  }

  async desactivarStock(materialId: number) {
    await this.stockRepo.update({ materialId }, { activo: false, cantidad: 0 });
  }

  // ==============================
  // Historial de Movimientos
  // ==============================

  async getSaldoPendiente(materialId: number) {
    const movimientos = await this.getMovimientosPorMaterial(materialId);
    let saldo = 0;
    for (const mov of movimientos) {
      if (
        mov.tipoMovimiento?.nombre.toLowerCase().includes('prestamo') &&
        mov.estado === 'aprobado'
      ) {
        const totalPrestado =
          mov.detalles?.reduce((a, d) => a + d.cantidad, 0) ?? 0;
        const totalDevuelto = await this.movimientoRepo
          .createQueryBuilder('mov')
          .innerJoin('mov.tipoMovimiento', 'tipo')
          .innerJoin('mov.detalles', 'det')
          .select('COALESCE(SUM(det.cantidad),0)', 'total')
          .where('mov.movimientoOrigenId = :id', { id: mov.id })
          .andWhere('tipo.nombre ILIKE :tipoNombre', {
            tipoNombre: '%devolución%',
          })
          .getRawOne();

        saldo += totalPrestado - parseInt(totalDevuelto.total);
      }
    }
    return saldo;
  }
}
