import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { Persona } from 'src/personas/entities/persona.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notificacion)
    private notificationsRepository: Repository<Notificacion>,
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  async findByUser(userId: number): Promise<Notificacion[]> {
    return this.notificationsRepository.find({
      where: { persona: { id: userId } },
      order: { id: 'DESC' }, 
    });
  }

  // Crear notificación genérica
  async create(dto: CreateNotificacionDto): Promise<Notificacion> {
    const persona = await this.personaRepository.findOne({
      where: { id: dto.personaId }
    });
    
    if (!persona) {
      throw new Error(`Persona con ID ${dto.personaId} no encontrada`);
    }

    const notificacion = this.notificationsRepository.create({
      tipo: dto.tipo,
      mensaje: dto.mensaje,
      persona: persona,
      leida: dto.leida || false,
      relacionadoId: dto.relacionadoId
    });

    return await this.notificationsRepository.save(notificacion);
  }

  // Notificación cuando se solicita un material
  async crearNotificacionSolicitud(
    movimiento: Movimiento, 
    solicitante: Persona, 
    aprobador: Persona
  ): Promise<void> {
    // Notificación para el aprobador
    await this.create({
      tipo: 'solicitud_pendiente',
      mensaje: `${solicitante.nombre} ${solicitante.apellido} ha solicitado ${movimiento.cantidad} unidades de ${movimiento.material.nombre}`,
      personaId: aprobador.id,
      relacionadoId: movimiento.id,
      titulo: 'Nueva Solicitud de Material'
    });

    // Notificación para el solicitante (confirmación)
    await this.create({
      tipo: 'solicitud_material',
      mensaje: `Tu solicitud de ${movimiento.cantidad} unidades de ${movimiento.material.nombre} ha sido enviada y está pendiente de aprobación`,
      personaId: solicitante.id,
      relacionadoId: movimiento.id,
      titulo: 'Solicitud Enviada'
    });
  }

  // Notificación cuando se aprueba una solicitud
  async crearNotificacionAprobacion(
    movimiento: Movimiento,
    solicitante: Persona,
    aprobador: Persona,
    estado: 'APROBADO' | 'RECHAZADO'
  ): Promise<void> {
    const esAprobado = estado === 'APROBADO';
    
    // Notificación para el solicitante
    await this.create({
      tipo: esAprobado ? 'solicitud_aprobada' : 'solicitud_rechazada',
      mensaje: `Tu solicitud de ${movimiento.cantidad} unidades de ${movimiento.material.nombre} ha sido ${esAprobado ? 'aprobada' : 'rechazada'} por ${aprobador.nombre} ${aprobador.apellido}`,
      personaId: solicitante.id,
      relacionadoId: movimiento.id,
      titulo: `Solicitud ${esAprobado ? 'Aprobada' : 'Rechazada'}`
    });
  }

  // Notificaciones para materiales próximos a caducar (solo para admins)
  async crearNotificacionesCaducidad(): Promise<void> {
    try {
      // Obtener administradores (personas con rol de admin)
      const administradores = await this.personaRepository.find({
        where: { rol: { nombre: 'Administrador' } },
        relations: ['rol']
      });

      if (administradores.length === 0) {
        console.log('No se encontraron administradores para enviar notificaciones de caducidad');
        return;
      }

      // Calcular fecha límite (30 días desde hoy)
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() + 30);
      const fechaLimiteStr = fechaLimite.toISOString().split('T')[0]; // Formato YYYY-MM-DD

      // Obtener materiales que caducan y están próximos a vencer
      const materialesProximosCaducar = await this.materialRepository.find({
        where: {
          caduca: true,
          activo: true,
          fechaVencimiento: LessThanOrEqual(fechaLimiteStr)
        }
      });

      console.log(`Encontrados ${materialesProximosCaducar.length} materiales próximos a caducar`);

      // Crear notificaciones para cada administrador y cada material
      for (const admin of administradores) {
        for (const material of materialesProximosCaducar) {
          // Verificar si ya existe una notificación reciente para este material y admin
          const notificacionExistente = await this.notificationsRepository.findOne({
            where: {
              persona: { id: admin.id },
              relacionadoId: material.id,
              tipo: 'material_caducidad',
              fecha: MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Últimos 7 días
            }
          });

          if (!notificacionExistente) {
            const diasRestantes = Math.ceil(
              (new Date(material.fechaVencimiento?.toString() ?? '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            let mensaje: string;
            if (diasRestantes <= 0) {
              mensaje = `El material "${material.nombre}" ya ha caducado`;
            } else if (diasRestantes <= 7) {
              mensaje = `El material "${material.nombre}" caduca en ${diasRestantes} día(s)`;
            } else {
              mensaje = `El material "${material.nombre}" caduca en ${diasRestantes} días`;
            }

            await this.create({
              tipo: 'material_caducidad',
              mensaje,
              personaId: admin.id,
              relacionadoId: material.id,
              titulo: 'Material Próximo a Caducar'
            });

            console.log(`Notificación de caducidad creada para admin ${admin.id} - material ${material.id}`);
          }
        }
      }
    } catch (error) {
      console.error('Error al crear notificaciones de caducidad:', error);
      throw error;
    }
  }

  // Marcar notificación como leída
  async markAsReadForUser(id: number, userId: number): Promise<Notificacion> {
    const notification = await this.notificationsRepository.findOne({ 
      where: { id, persona: { id: userId } },
      relations: ['persona']
    });
    
    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada o no pertenece al usuario.`);
    }
    
    notification.leida = true;
    notification.fecha = new Date();
    return this.notificationsRepository.save(notification);
  }

  // Obtener notificaciones no leídas
  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationsRepository.count({
      where: { persona: { id: userId }, leida: false }
    });
  }

  // Marcar todas las notificaciones como leídas
  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationsRepository.update(
      { persona: { id: userId }, leida: false },
      { leida: true }
    );
  }
}