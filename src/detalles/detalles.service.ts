import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Detalles } from "./entities/detalle.entity";

@Injectable()
export class DetallesService {
  constructor(
    @InjectRepository(Detalles)
    private readonly detalleRepository: Repository<Detalles>,
  ) {}


  async findAll(filtros?: any) {
    const query = this.detalleRepository.createQueryBuilder('detalle')
      .leftJoinAndSelect('detalle.material', 'material')
      .leftJoinAndSelect('detalle.tipoMovimiento', 'tipoMovimiento')
      .leftJoinAndSelect('detalle.solicitante', 'solicitante')
      .where('detalle.activo = :activo', { activo: true })
      .orderBy('detalle.fecha', 'DESC');

    // Aplicar filtros si existen
    if (filtros?.estado) {
      query.andWhere('detalle.estado = :estado', { estado: filtros.estado });
    }
    if (filtros?.materialId) {
      query.andWhere('detalle.materialId = :materialId', { materialId: filtros.materialId });
    }
    if (filtros?.tipoMovimientoId) {
      query.andWhere('detalle.tipoMovimientoId = :tipoMovimientoId', { tipoMovimientoId: filtros.tipoMovimientoId });
    }
    if (filtros?.solicitanteId) {
      query.andWhere('detalle.solicitanteId = :solicitanteId', { solicitanteId: filtros.solicitanteId });
    }

    const detalles = await query.getMany();

    return {
      message: 'Detalles obtenidos exitosamente',
      data: detalles
    };
  }

  // Obtener un detalle específico por ID
  async findOne(id: number) {
    const detalle = await this.detalleRepository.findOne({
      where: { id },
      relations: ['material', 'tipoMovimiento', 'solicitante']
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
    }

    return {
      message: 'Detalle encontrado',
      data: detalle
    };
  }

  // Obtener detalles por movimiento
  async findByMovimiento(movimientoId: number) {
    const detalles = await this.detalleRepository.find({
      where: { movimientoId },
      relations: ['material', 'tipoMovimiento', 'solicitante'],
      order: { fecha: 'DESC' }
    });

    return {
      message: `Detalles del movimiento ${movimientoId}`,
      data: detalles
    };
  }

  // Obtener detalles por estado
  async findByEstado(estado: 'NO_APROBADO' | 'APROBADO' | 'RECHAZADO') {
    const detalles = await this.detalleRepository.find({
      where: { estado, activo: true },
      relations: ['material', 'tipoMovimiento', 'solicitante'],
      order: { fecha: 'DESC' }
    });
  
    return {
      message: `Detalles con estado ${estado}`,
      data: detalles
    };
  }

  // Obtener historial de movimientos de un material específico
  async findHistorialMaterial(materialId: number) {
    const detalles = await this.detalleRepository.find({
      where: { materialId, activo: true },
      relations: ['material', 'tipoMovimiento', 'solicitante'],
      order: { fecha: 'DESC' }
    });

    return {
      message: `Historial de movimientos del material ${materialId}`,
      data: detalles
    };
  }

  // Obtener estadísticas de movimientos
  async getEstadisticas() {
    const [total, aprobados, rechazados, pendientes] = await Promise.all([
      this.detalleRepository.count({ where: { activo: true } }),
      this.detalleRepository.count({ where: { estado: 'APROBADO', activo: true } }),
      this.detalleRepository.count({ where: { estado: 'RECHAZADO', activo: true } }),
      this.detalleRepository.count({ where: { estado: 'NO_APROBADO', activo: true } })
    ]);

    return {
      message: 'Estadísticas de detalles',
      data: {
        total,
        aprobados,
        rechazados,
        pendientes
      }
    };
  }
}