// src/detalles/detalles.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Detalles } from './entities/detalle.entity';
import { CreateDetallesDto } from './dto/create-detalle.dto';
import { UpdateDetallesDto } from './dto/update-detalle.dto';
import { Solicitud } from 'src/solicitudes/entities/solicitud.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';

@Injectable()
export class DetallesService {
  constructor(
    @InjectRepository(Detalles)
    private readonly repo: Repository<Detalles>,
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepository: Repository<TipoMovimiento>,
    private readonly dataSource: DataSource,
  ) {}

  async aprobar(id: number, personaApruebaId?: number) {
    return await this.dataSource.transaction(async (manager) => {
      console.log('🔄 Iniciando proceso de aprobación para detalle:', id);

      const detalle = await manager.findOne(Detalles, {
        where: { id },
        relations: {
          solicitud: true,
          material: true
        }
      });

      if (!detalle) {
        throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
      }

      if (detalle.estado !== 'PENDIENTE') {
        throw new BadRequestException(`El detalle debe estar en estado PENDIENTE. Estado actual: ${detalle.estado}`);
      }

      console.log(' Detalle encontrado:', detalle.id);
      console.log(' Material:', detalle.material?.nombre);
      console.log(' Cantidad a procesar:', detalle.cantidad);

    
      const movimiento = await manager.findOne(Movimiento, {
        where: { detalleId: detalle.id },
        relations: {
          tipoMovimiento: true,
          material: true
        }
      });

      if (!movimiento) {
        throw new BadRequestException('No se encontró movimiento asociado al detalle');
      }

      console.log(' Movimiento encontrado:', movimiento.id, 'Tipo:', movimiento.tipoMovimiento?.nombre);

      detalle.estado = 'APROBADO';
      if (personaApruebaId) {
        detalle.personaApruebaId = personaApruebaId;
      }
      detalle.fechaActualizacion = new Date();
      await manager.save(Detalles, detalle);
      console.log(' Detalle aprobado');

  
      const detallesPendientes = await manager.count(Detalles, {
        where: {
          solicitudId: detalle.solicitudId,
          estado: 'PENDIENTE'
        }
      });

      if (detallesPendientes === 0) {
        const solicitud = await manager.findOne(Solicitud, {
          where: { id: detalle.solicitudId }
        });
        if (solicitud) {
          solicitud.estado = 'APROBADA';
          solicitud.fechaActualizacion = new Date();
          await manager.save(Solicitud, solicitud);
          console.log(' Solicitud completamente aprobada');
        }
      }

      await this.ejecutarMovimientoInventario(manager, movimiento, detalle.material);

      console.log('🎉 Aprobación completada exitosamente');
      return {
        detalle,
        movimiento,
        message: 'Detalle aprobado y movimiento de inventario ejecutado'
      };
    });
  }

  private async ejecutarMovimientoInventario(manager: any, movimiento: Movimiento, material: Material) {
    console.log('📦 Ejecutando movimiento de inventario...');
    console.log(`   - Tipo: ${movimiento.tipoMovimiento?.nombre}`);
    console.log(`   - Cantidad: ${movimiento.cantidad}`);
    console.log(`   - Stock actual: ${material.stock}`);

    const tipoMovimiento = movimiento.tipoMovimiento;
    if (!tipoMovimiento) {
      throw new BadRequestException('Tipo de movimiento no encontrado');
    }

    if (tipoMovimiento.nombre?.toLowerCase() === 'entrada') {
      material.stock += movimiento.cantidad;
      console.log(` Entrada: +${movimiento.cantidad}`);
    } else if (tipoMovimiento.nombre?.toLowerCase() === 'salida') {
      if (material.stock < movimiento.cantidad) {
        throw new BadRequestException(`Stock insuficiente. Disponible: ${material.stock}, Requerido: ${movimiento.cantidad}`);
      }
      material.stock -= movimiento.cantidad;
      console.log(` Salida: -${movimiento.cantidad}`);
    }

    await manager.save(Material, material);
    console.log(` Stock actualizado: ${material.stock}`);
  }

  async rechazar(id: number, personaApruebaId?: number) {
    return await this.dataSource.transaction(async (manager) => {
      const detalle = await manager.findOne(Detalles, {
        where: { id },
        relations: ['solicitud'],
      });
      
      if (!detalle) {
        throw new NotFoundException(`Detalle no encontrado id: ${id}`);
      }
      
      if (detalle.estado !== 'PENDIENTE') {
        throw new BadRequestException('Solo se pueden rechazar detalles pendientes');
      }

      detalle.estado = 'RECHAZADO';
      if (personaApruebaId) {
        detalle.personaApruebaId = personaApruebaId;
      }
      detalle.fechaActualizacion = new Date();
      await manager.save(Detalles, detalle);

      // Actualizar solicitud
      const solicitud = detalle.solicitud;
      solicitud.estado = 'RECHAZADA';
      solicitud.fechaActualizacion = new Date();
      await manager.save(Solicitud, solicitud);

      return { message: 'Detalle rechazado', data: detalle };
    });
  }


  async findPendientes() {
    const detallesPendientes = await this.repo.find({
      where: { estado: 'PENDIENTE' },
      relations: {
        material: true,
        solicitud: {
          solicitante: true
        }
      },
      order: {
        fechaCreacion: 'DESC'
      }
    });

    return {
      message: 'Detalles pendientes de aprobación',
      data: detallesPendientes
    };
  }

  async findBySolicitud(solicitudId: number) {
    const detalles = await this.repo.find({
      where: { solicitudId },
      relations: {
        material: true,
        solicitud: true
      },
      order: {
        fechaCreacion: 'DESC'
      }
    });

    return {
      message: `Detalles de la solicitud ${solicitudId}`,
      data: detalles
    };
  }

  async findByEstado(estado: string) {
    const detalles = await this.repo.find({
      where: { estado: estado as 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ENTREGADO' | 'DEVUELTO' },
      relations: {
        material: true,
        solicitud: {
          solicitante: true
        }
      },
      order: {
        fechaCreacion: 'DESC'
      }
    });

    return {
      message: `Detalles con estado: ${estado}`,
      data: detalles
    };
  }

  async create(dto: CreateDetallesDto) {
    const nuevo = this.repo.create(dto);
    const guardado = await this.repo.save(nuevo);
    return { message: 'Detalle creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({
      relations: {
        material: true,
        solicitud: {
          solicitante: true
        }
      },
      order: {
        fechaCreacion: 'DESC'
      }
    });
    return { message: 'Listado de detalles', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({
      where: { id },
      relations: {
        material: true,
        solicitud: {
          solicitante: true
        }
      }
    });
    if (!encontrado) {
      throw new NotFoundException(`Detalle no encontrado id: ${id}`);
    }
    return { message: 'Detalle encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateDetallesDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ['material', 'solicitud'],
    });
    return { message: 'Detalle actualizado', data: actualizado };
  }

  async remove(id: number) {
    const detalle = await this.repo.findOne({ where: { id } });
    if (!detalle) {
      throw new NotFoundException(`Detalle no encontrado id: ${id}`);
    }
    
    if (detalle.estado === 'APROBADO') {
      throw new BadRequestException('No se puede eliminar un detalle aprobado');
    }
    
    await this.repo.delete(id);
    return { message: 'Detalle eliminado' };
  }

  async findHistorialCompleto() {
    const query = `
      SELECT 
        d.id as "detalleId",
        d.cantidad,
        d.estado,
        d."fechaCreacion" as "fechaSolicitud",
        d."fechaActualizacion" as "fechaActualizacion",
        
        -- Material
        m.nombre as "materialNombre",
        m.descripcion as "materialDescripcion",
        
        -- Solicitud
        s.descripcion as "solicitudDescripcion",
        s.estado as "solicitudEstado",
        
        -- Persona Solicitante (a través de la solicitud)
        ps.id as "personaSolicitanteId",
        ps.identificacion as "personaIdentificacion",
        ps.nombre as "personaNombre",
        ps.apellido as "personaApellido",
        ps.correo as "personaCorreo",
        ps.telefono as "personaTelefono",
        
        -- Ficha
        f.id as "fichaId",
        f.numero as "fichaNumero",
        f."cantidadAprendices",
        
        -- Titulado (área de la ficha)
        t.id as "tituladoId",
        t.nombre as "tituladoNombre",
        
        -- Área
        a.id as "areaId",
        a.nombre as "areaNombre",
        
        -- Centro (a través de área-centro)
        c.id as "centroId",
        c.nombre as "centroNombre",
        
        -- Sede
        se.id as "sedeId",
        se.nombre as "sedeNombre",
        se.direccion as "sedeDireccion",
        
        -- Municipio
        mu.id as "municipioId",
        mu.nombre as "municipioNombre",
        
        -- Persona que aprobó
        pa.id as "personaApruebaId",
        pa.nombre as "personaApruebaNombre",
        pa.apellido as "personaApruebaApellido"
        
      FROM detalles d
      LEFT JOIN material m ON d."materialId" = m.id
      LEFT JOIN solicitud s ON d."solicitudId" = s.id
      LEFT JOIN persona ps ON s."solicitanteId" = ps.id
      LEFT JOIN ficha f ON ps."fichaId" = f.id
      LEFT JOIN titulado t ON f.id = t."fichaId"
      LEFT JOIN area a ON t."areaId" = a.id
      LEFT JOIN area_centro ac ON a.id = ac."areaId"
      LEFT JOIN centro c ON ac."centroId" = c.id
      LEFT JOIN sede se ON c.id = se."centroId"
      LEFT JOIN municipio mu ON c."municipioId" = mu.id
      LEFT JOIN persona pa ON d."personaApruebaId" = pa.id
      
      WHERE d.id IS NOT NULL
      ORDER BY d."fechaCreacion" DESC, d.id DESC
    `;
    
    const historial = await this.repo.query(query);
    
    return {
      message: 'Historial completo de detalles',
      data: historial
    };
  }

  async findHistorialPorPersona(personaId: number) {
    const query = `
      SELECT 
        d.id as "detalleId",
        d.cantidad,
        d.estado,
        d."fechaCreacion" as "fechaSolicitud",
        d."fechaActualizacion" as "fechaActualizacion",
        
        -- Material
        m.nombre as "materialNombre",
        m.descripcion as "materialDescripcion",
        
        -- Solicitud
        s.descripcion as "solicitudDescripcion",
        s.estado as "solicitudEstado",
        
        -- Persona Solicitante
        ps.id as "personaSolicitanteId",
        ps.identificacion as "personaIdentificacion",
        ps.nombre as "personaNombre",
        ps.apellido as "personaApellido",
        ps.correo as "personaCorreo",
        ps.telefono as "personaTelefono",
        
        -- Información organizacional
        f.numero as "fichaNumero",
        t.nombre as "tituladoNombre",
        a.nombre as "areaNombre",
        c.nombre as "centroNombre",
        se.nombre as "sedeNombre",
        se.direccion as "sedeDireccion",
        mu.nombre as "municipioNombre"
        
      FROM detalles d
      LEFT JOIN material m ON d."materialId" = m.id
      LEFT JOIN solicitud s ON d."solicitudId" = s.id
      LEFT JOIN persona ps ON s."solicitanteId" = ps.id
      LEFT JOIN ficha f ON ps."fichaId" = f.id
      LEFT JOIN titulado t ON f.id = t."fichaId"
      LEFT JOIN area a ON t."areaId" = a.id
      LEFT JOIN area_centro ac ON a.id = ac."areaId"
      LEFT JOIN centro c ON ac."centroId" = c.id
      LEFT JOIN sede se ON c.id = se."centroId"
      LEFT JOIN municipio mu ON c."municipioId" = mu.id
      
      WHERE ps.id = $1
      ORDER BY d."fechaCreacion" DESC, d.id DESC
    `;
    
    const historial = await this.repo.query(query, [personaId]);
    
    return {
      message: `Historial de detalles para persona ID: ${personaId}`,
      data: historial
    };
  }
}
