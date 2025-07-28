import { DataSource } from 'typeorm';
import { Modulo } from 'src/modulos/entities/modulo.entity';

export const seedModulos = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Modulo);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Módulos ya existen, se omite seeding.');
    return;
  }

  const modulos = [
    { nombre: 'Materiales' },
    { nombre: 'Sedes' },
    { nombre: 'Centros' },
    { nombre: 'Áreas' },
    { nombre: 'Titulados' },
    { nombre: 'Fichas' },
    { nombre: 'Movimientos' },
    { nombre: 'Solicitudes' },
    { nombre: 'Usuarios' },
    { nombre: 'Roles' },
    { nombre: 'Permisos' },
  ];


  const modulosEntities = modulos.map(modulo => repo.create(modulo));


  await repo.save(modulosEntities);

  console.log('✔ Módulos insertados correctamente');
  return modulosEntities; 
};