import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detalles } from './entities/detalle.entity';

@Injectable()
export class DetallesService {
  constructor(
    @InjectRepository(Detalles)
    private readonly detalleRepository: Repository<Detalles>,
  ) {}

  // 🚀 OPTIMIZADO: findAll con paginación
  async findAll(filtros?: any) {
    const page = filtros?.page || 1;
    const limit = Math.min(filtros?.limit || 50, 100); // Máximo 100 registros
    const skip = (page - 1) * limit;

    const query = this.detalleRepository
      .createQueryBuilder('detalle')
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
      query.andWhere('detalle.materialId = :materialId', {
        materialId: filtros.materialId,
      });
    }
    if (filtros?.tipoMovimientoId) {
      query.andWhere('detalle.tipoMovimientoId = :tipoMovimientoId', {
        tipoMovimientoId: filtros.tipoMovimientoId,
      });
    }
    if (filtros?.solicitanteId) {
      query.andWhere('detalle.solicitanteId = :solicitanteId', {
        solicitanteId: filtros.solicitanteId,
      });
    }

    // 🚀 PAGINACIÓN: Obtener datos y total
    const [detalles, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Detalles obtenidos exitosamente',
      data: detalles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  async findByEstado(
    estado: 'NO_APROBADO' | 'APROBADO' | 'RECHAZADO',
    page: number = 1,
    limit: number = 50,
  ) {
    const maxLimit = Math.min(limit, 100);
    const skip = (page - 1) * maxLimit;

    const [detalles, total] = await this.detalleRepository.findAndCount({
      where: { estado, activo: true },
      relations: ['material', 'tipoMovimiento', 'solicitante'],
      order: { fecha: 'DESC' },
      skip,
      take: maxLimit,
    });

    return {
      message: `Detalles con estado ${estado}`,
      data: detalles,
      pagination: {
        page,
        limit: maxLimit,
        total,
        totalPages: Math.ceil(total / maxLimit),
      },
    };
  }

  // 🚀 OPTIMIZADO: findHistorialMaterial con paginación
  async findHistorialMaterial(
    materialId: number,
    page: number = 1,
    limit: number = 50,
  ) {
    const maxLimit = Math.min(limit, 100);
    const skip = (page - 1) * maxLimit;

    const [detalles, total] = await this.detalleRepository.findAndCount({
      where: { materialId, activo: true },
      relations: ['material', 'tipoMovimiento', 'solicitante'],
      order: { fecha: 'DESC' },
      skip,
      take: maxLimit,
    });

    return {
      message: `Historial de movimientos del material ${materialId}`,
      data: detalles,
      pagination: {
        page,
        limit: maxLimit,
        total,
        totalPages: Math.ceil(total / maxLimit),
      },
    };
  }

  // Obtener un detalle específico por ID
  async findOne(id: number) {
    const detalle = await this.detalleRepository.findOne({
      where: { id },
      relations: ['material', 'tipoMovimiento', 'solicitante'],
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
    }

    return {
      message: 'Detalle encontrado',
      data: detalle,
    };
  }

  // Obtener detalles por movimiento
  async findByMovimiento(movimientoId: number) {
    const detalles = await this.detalleRepository.find({
      where: { movimientoId },
      relations: ['material', 'tipoMovimiento', 'solicitante'],
      order: { fecha: 'DESC' },
    });

    return {
      message: `Detalles del movimiento ${movimientoId}`,
      data: detalles,
    };
  }

  // Obtener estadísticas de movimientos
  async getEstadisticas() {
    const [total, aprobados, rechazados, pendientes] = await Promise.all([
      this.detalleRepository.count({ where: { activo: true } }),
      this.detalleRepository.count({
        where: { estado: 'APROBADO', activo: true },
      }),
      this.detalleRepository.count({
        where: { estado: 'RECHAZADO', activo: true },
      }),
      this.detalleRepository.count({
        where: { estado: 'NO_APROBADO', activo: true },
      }),
    ]);

    return {
      message: 'Estadísticas de detalles',
      data: {
        total,
        aprobados,
        rechazados,
        pendientes,
      },
    };
  }
}
