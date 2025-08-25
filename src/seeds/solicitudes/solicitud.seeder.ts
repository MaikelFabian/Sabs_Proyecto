import { DataSource } from 'typeorm';
import { Solicitud } from 'src/solicitudes/entities/solicitud.entity';
import { Persona } from 'src/personas/entities/persona.entity';

export const seedSolicitud = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Solicitud);
  const personaRepo = dataSource.getRepository(Persona);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Solicitudes ya existen, se omite seeding.');
    return;
  }

  const solicitante = await personaRepo.findOne({ where: { id: 1 } }); // Asumiendo ID 1 existe
  if (!solicitante) return;

  const solicitudes = [
    { descripcion: 'Solicitud de materiales para proyecto A', solicitante, estado: 'PENDIENTE' },
    { descripcion: 'Solicitud de devolución de equipo', solicitante, estado: 'PENDIENTE' },
    { descripcion: 'Solicitud de consumibles', solicitante, estado: 'PENDIENTE' },
  ];

  const entities = repo.create(solicitudes.map(s => ({
    ...s,
    estado: s.estado as "PENDIENTE" | "APROBADA" | "RECHAZADA" | "ENTREGADA" | "DEVUELTA"
  })));
  await repo.save(entities);

  console.log('✔ Solicitudes insertadas correctamente');
};