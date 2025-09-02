// src/movimientos/movimientos.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, EntityManager, ILike } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { Detalle } from 'src/detalles/entities/detalle.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { DetallesService } from 'src/detalles/detalles.service';
import { Persona } from 'src/personas/entities/persona.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';

// Tipado para préstamos con saldo (extiende Movimiento con campos calculados)
type PrestamoConSaldo = Movimiento & {
  totalPrestado: number;
  totalDevuelto: number;
  saldoPendiente: number;
  detallesMaterial: Detalle[];
};

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepo: Repository<Movimiento>,
    private readonly detallesService: DetallesService,
    @InjectRepository(Detalle)
    private readonly detalleRepo: Repository<Detalle>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovRepo: Repository<TipoMovimiento>,
  ) {}

  // -----------------------
  // CREAR MOVIMIENTO
  // -----------------------
  async createMovimiento(dto: {
    personaSolicitaId: number;
    sitioOrigenId: number;
    sitioDestinoId?: number | null;
    detalles: { materialId: number; cantidad: number }[];
    tipoMovimientoId?: number | null; // <-- NUEVO
  }) {
    const movimiento = this.movimientoRepo.create({
      personaSolicitaId: dto.personaSolicitaId,
      sitioOrigenId: dto.sitioOrigenId,
      sitioDestinoId: dto.sitioDestinoId ?? null,
      estado: 'pendiente',
      tipoMovimientoId: dto.tipoMovimientoId ?? null, // <-- NUEVO
    });
    const savedMovimiento = await this.movimientoRepo.save(movimiento);

    for (const det of dto.detalles) {
      await this.detallesService.create({
        movimientoId: savedMovimiento.id,
        materialId: det.materialId,
        cantidad: det.cantidad,
        personaSolicitaId: dto.personaSolicitaId,
      });
    }

    return this.findOne(savedMovimiento.id);
  }

  // -----------------------
  // APROBAR MOVIMIENTO
  // -----------------------
  async aprobarMovimiento(id: number, aprobadoPorId: number) {
    return this.stockRepo.manager.transaction(async (manager) => {
      const movimientoRepo = manager.getRepository(Movimiento);
      const personaRepo = manager.getRepository(Persona);
      const detalleRepo = manager.getRepository(Detalle);

      const movimiento = await movimientoRepo.findOne({
        where: { id },
        relations: [
          'detalles',
          'detalles.material',
          'movimientoOrigen',
          'tipoMovimiento',
        ],
      });

      if (!movimiento) throw new NotFoundException('Movimiento no encontrado');
      if (movimiento.estado !== 'pendiente')
        throw new BadRequestException(
          `El movimiento ya está en estado ${movimiento.estado}`,
        );

      // Validar aprobador antes de cualquier ajuste de stock
      if (aprobadoPorId != null) {
        const aprobador = await personaRepo.findOne({ where: { id: aprobadoPorId } });
        if (!aprobador) {
          throw new BadRequestException('Aprobador no existe');
        }
      } else {
        throw new BadRequestException('aprobadoPorId es requerido');
      }

      // Ajustar stock dentro de la transacción
      await this.ajustarStockTransactional(manager, movimiento);

      // Marcar detalles como aprobados
      await detalleRepo
        .createQueryBuilder()
        .update(Detalle)
        .set({ estado: 'aprobado', personaApruebaId: aprobadoPorId })
        .where('movimientoId = :id', { id: movimiento.id })
        .execute();

      // Guardar movimiento aprobado
      movimiento.estado = 'aprobado';
      movimiento.personaApruebaId = aprobadoPorId;
      await movimientoRepo.save(movimiento);

      // Devolver el movimiento con todas las relaciones
      return movimientoRepo.findOne({
        where: { id: movimiento.id },
        relations: [
          'detalles',
          'detalles.material',
          'personaSolicita',
          'personaAprueba',
          'sitioOrigen',
          'sitioDestino',
          'tipoMovimiento',
          'movimientoOrigen',
        ],
      });
    });
  }

  // -----------------------
  // RECHAZAR MOVIMIENTO
  // -----------------------
  async rechazarMovimiento(id: number, rechazadoPorId: number) {
    const movimiento = await this.movimientoRepo.findOne({
      where: { id },
      relations: ['detalles'],
    });

    if (!movimiento) throw new NotFoundException(`Movimiento no encontrado`);
    if (movimiento.estado !== 'pendiente')
      throw new BadRequestException(
        `Solo se pueden rechazar movimientos pendientes`,
      );

    movimiento.estado = 'rechazado';
    movimiento.personaApruebaId = rechazadoPorId;
    await this.movimientoRepo.save(movimiento);

    return this.findOne(movimiento.id);
  }

  // -----------------------
  // AJUSTAR STOCK (PRÉSTAMO / DEVOLUCIÓN) - TRANSACCIONAL
  // -----------------------
  private async ajustarStockTransactional(manager: EntityManager, movimiento: Movimiento) {
    if (!movimiento.detalles || movimiento.detalles.length === 0) {
      throw new BadRequestException('El movimiento no tiene detalles');
    }

    const stockRepo = manager.getRepository(Stock);
    const materialRepo = manager.getRepository(Material);

    for (const detalle of movimiento.detalles) {
      const material = await materialRepo.findOne({
        where: { id: detalle.materialId },
      });
      if (!material)
        throw new NotFoundException(
          `Material ID ${detalle.materialId} no encontrado`,
        );

      // DEVOLUCIÓN
      if (movimiento.movimientoOrigenId) {
        if (!movimiento.sitioDestinoId)
          throw new BadRequestException(
            `Movimiento de devolución sin sitio destino`,
          );

        await stockRepo.increment(
          {
            materialId: detalle.materialId,
            sitioId: movimiento.sitioDestinoId,
          },
          'cantidad',
          detalle.cantidad,
        );
      }
      // PRÉSTAMO / CONSUMO
      else {
        // Stocks del sitio origen
        const stocksSitio = await stockRepo.find({
          where: {
            materialId: detalle.materialId,
            activo: true,
            sitioId: movimiento.sitioOrigenId!,
          },
        });

        // Fallback para stocks antiguos con sitioId NULL si el material pertenece al mismo sitio
        let candidateStocks = [...stocksSitio];
        if (material.sitioId && material.sitioId === movimiento.sitioOrigenId) {
          const stocksSinSitio = await stockRepo.find({
            where: {
              materialId: detalle.materialId,
              activo: true,
              sitioId: IsNull(),
            },
          });
          if (stocksSinSitio.length) {
            candidateStocks.push(...stocksSinSitio);
          }
        }

        let cantidadRestante = detalle.cantidad;

        for (const stock of candidateStocks) {
          if (cantidadRestante <= 0) break;
          const descontar = Math.min(stock.cantidad, cantidadRestante);
          stock.cantidad -= descontar;

          // Normalizar sitioId si era NULL
          if (stock.sitioId == null) {
            stock.sitioId = movimiento.sitioOrigenId!;
          }

          await stockRepo.save(stock);
          cantidadRestante -= descontar;
        }

        if (cantidadRestante > 0)
          throw new BadRequestException(
            `No hay suficiente stock para ${material.nombre}`,
          );

        // Incrementar stock en destino si aplica
        if (movimiento.sitioDestinoId) {
          let stockDestino = await stockRepo.findOne({
            where: {
              materialId: detalle.materialId,
              sitioId: movimiento.sitioDestinoId,
            },
          });
          if (!stockDestino) {
            stockDestino = stockRepo.create({
              materialId: detalle.materialId,
              cantidad: 0,
              activo: true,
              sitioId: movimiento.sitioDestinoId,
            });
          }
          stockDestino.cantidad += detalle.cantidad;
          await stockRepo.save(stockDestino);
        }
      }
    }
  }

  // -----------------------
  // DEVOLVER MATERIAL (CREAR MOVIMIENTO DEVOLUCIÓN)
  // -----------------------
  async devolverMaterial(dto: {
    movimientoOrigenId: number;
    personaSolicitaId: number;
    detalles: { materialId: number; cantidad: number }[];
  }) {
    const movimientoOrigen = await this.movimientoRepo.findOne({
      where: { id: dto.movimientoOrigenId },
      relations: ['detalles', 'tipoMovimiento'],
    });
    if (!movimientoOrigen)
      throw new NotFoundException('Movimiento original no encontrado');

    for (const det of dto.detalles) {
      const prestado = movimientoOrigen.detalles?.find(
        (d) => d.materialId === det.materialId,
      );
      if (!prestado || det.cantidad > prestado.cantidad)
        throw new BadRequestException(
          'No se puede devolver más de lo prestado',
        );
    }

    // Buscar tipo "Devolución" (o "Entrada") para asignarlo al movimiento de devolución
    const tipoDevolucion = await this.tipoMovRepo.findOne({
      where: [
        { nombre: ILike('%devolucion%') },
        { nombre: ILike('%devolución%') },
        { nombre: ILike('%entrada%') },
      ],
    });

    const movimientoDevolucion = this.movimientoRepo.create({
      personaSolicitaId: dto.personaSolicitaId,
      sitioOrigenId:
        movimientoOrigen.sitioDestinoId ?? movimientoOrigen.sitioOrigenId,
      sitioDestinoId: movimientoOrigen.sitioOrigenId,
      estado: 'pendiente',
      movimientoOrigenId: movimientoOrigen.id,
      tipoMovimientoId: tipoDevolucion?.id ?? null, // <-- NUEVO
    });

    const savedDevolucion =
      await this.movimientoRepo.save(movimientoDevolucion);

    for (const det of dto.detalles) {
      await this.detallesService.create({
        movimientoId: savedDevolucion.id,
        materialId: det.materialId,
        cantidad: det.cantidad,
        personaSolicitaId: dto.personaSolicitaId,
      });
    }

    return this.findOne(savedDevolucion.id);
  }

  // -----------------------
  // CONSULTAS
  // -----------------------
  async findAll() {
    return this.movimientoRepo.find({
      relations: [
        'detalles',
        'detalles.material',
        'personaSolicita',
        'personaAprueba',
        'sitioOrigen',
        'sitioDestino',
        'tipoMovimiento',
        'movimientoOrigen',
      ],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number) {
    const movimiento = await this.movimientoRepo.findOne({
      where: { id },
      relations: [
        'detalles',
        'detalles.material',
        'personaSolicita',
        'personaAprueba',
        'sitioOrigen',
        'sitioDestino',
        'tipoMovimiento',
        'movimientoOrigen',
      ],
    });
    if (!movimiento) throw new NotFoundException('Movimiento no encontrado');
    return movimiento;
  }

  // -----------------------
  // SALDO PENDIENTE POR MATERIAL
  // -----------------------
  async getSaldoPendiente(materialId: number) {
    const movimientos = await this.movimientoRepo.find({
      relations: ['detalles', 'tipoMovimiento'],
    });

    let saldo = 0;
    for (const mov of movimientos) {
      if (
        mov.tipoMovimiento?.nombre.toLowerCase().includes('prestamo') &&
        mov.estado === 'aprobado'
      ) {
        const totalPrestado =
          mov.detalles?.reduce((a, d) => a + d.cantidad, 0) ?? 0;
        const totalDevuelto = await this.detalleRepo
          .createQueryBuilder('detalle')
          .innerJoin('detalle.movimiento', 'mov')
          .innerJoin('mov.tipoMovimiento', 'tipo')
          .where('detalle.materialId = :materialId', { materialId })
          .andWhere('tipo.nombre ILIKE :tipo', { tipo: '%devolucion%' })
          .andWhere('mov.estado = :estado', { estado: 'aprobado' })
          .select('SUM(detalle.cantidad)', 'total')
          .getRawOne();

        const devuelto = parseInt(totalDevuelto?.total || '0');

        saldo += totalPrestado - devuelto;
      }
    }
    return saldo;
  }

  // ✅ NUEVO: Obtener préstamos activos por material
  async getPrestamosActivos(materialId: number): Promise<PrestamoConSaldo[]> {
    const prestamos = await this.movimientoRepo.find({
      where: {
        estado: 'aprobado',
      },
      relations: ['detalles', 'tipoMovimiento', 'personaSolicita', 'sitioOrigen', 'sitioDestino'],
    });

    // Filtrar solo préstamos que contengan el material específico
    const prestamosConMaterial = prestamos.filter(mov => 
      mov.tipoMovimiento?.nombre.toLowerCase().includes('prestamo') &&
      mov.detalles?.some(detalle => detalle.materialId === materialId)
    );

    // Calcular saldo pendiente para cada préstamo
    const prestamosConSaldo: PrestamoConSaldo[] = [];
    for (const prestamo of prestamosConMaterial) {
      const detallesMaterial = prestamo.detalles?.filter(d => d.materialId === materialId) || [];
      const totalPrestado = detallesMaterial.reduce((sum, d) => sum + d.cantidad, 0);

      // Calcular total devuelto para este préstamo específico
      const totalDevuelto = await this.detalleRepo
        .createQueryBuilder('detalle')
        .innerJoin('detalle.movimiento', 'mov')
        .innerJoin('mov.tipoMovimiento', 'tipo')
        .where('detalle.materialId = :materialId', { materialId })
        .andWhere('mov.movimientoOrigenId = :prestamoId', { prestamoId: prestamo.id })
        .andWhere('tipo.nombre ILIKE :tipo', { tipo: '%devolucion%' })
        .andWhere('mov.estado = :estado', { estado: 'aprobado' })
        .select('COALESCE(SUM(detalle.cantidad), 0)', 'total')
        .getRawOne();

      const devuelto = parseInt(totalDevuelto?.total || '0');
      const saldoPendiente = totalPrestado - devuelto;

      if (saldoPendiente > 0) {
        prestamosConSaldo.push({
          ...prestamo,
          totalPrestado,
          totalDevuelto: devuelto,
          saldoPendiente,
          detallesMaterial
        });
      }
    }

    return prestamosConSaldo;
  }
}
