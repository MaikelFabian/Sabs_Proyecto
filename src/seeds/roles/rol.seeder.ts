import { DataSource } from 'typeorm';
import { Rol } from 'src/roles/entities/role.entity';

export const seedRoles = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Rol);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Roles ya existen, se omite seeding.');
    return;
  }


  const roles = [
    { nombre: 'Administrador', activo: true },
    { nombre: 'Usuario', activo: true },
    { nombre: 'Instructor', activo: true },
    { nombre: 'Aprendiz', activo: true },
    { nombre: 'Invitado', activo: true },
  ];

  const rolesEntities = roles.map(rol => repo.create(rol));
  await repo.save(rolesEntities);

  console.log('✔ Roles insertados correctamente');
  return rolesEntities; 
};