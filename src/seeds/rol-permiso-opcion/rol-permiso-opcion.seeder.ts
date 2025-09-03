import { DataSource } from 'typeorm';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';
import { Rol } from 'src/roles/entities/role.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { Opcion } from 'src/opciones/entities/opcion.entity';

export const seedRolPermisoOpcion = async (dataSource: DataSource) => {
  const repoRolPermisoOpcion = dataSource.getRepository(RolPermisoOpcion);
  const repoRol = dataSource.getRepository(Rol);
  const repoPermiso = dataSource.getRepository(Permiso);
  const repoOpcion = dataSource.getRepository(Opcion);

  const existentes = await repoRolPermisoOpcion.count();
  if (existentes > 0) {
    console.log('Relaciones Rol-Permiso-Opción ya existen, se omite seeding.');
    return;
  }

 
  const rolAdmin = await repoRol.findOne({ where: { nombre: 'Administrador' } });
  if (!rolAdmin) {
    console.log('No se encontró el rol de Administrador, se omite seeding.');
    return;
  }


  const permisos = await repoPermiso.find({ relations: ['opcion'] });
  if (permisos.length === 0) {
    console.log('No hay permisos para asignar, se omite seeding.');
    return;
  }

  // Crear relaciones para el administrador con todos los permisos
  const relacionesEntities = [];

  for (const permiso of permisos) {
    if (!permiso.opcion) continue;
    
    const relacion = repoRolPermisoOpcion.create({
      rol: rolAdmin,
      permiso: permiso,
      opcion: permiso.opcion,
    });
    (relacionesEntities as RolPermisoOpcion[]).push(relacion);
  }

  // Guardar relaciones
  await repoRolPermisoOpcion.save(relacionesEntities);

  console.log('✔ Relaciones Rol-Permiso-Opción insertadas correctamente');
};