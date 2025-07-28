import { DataSource } from 'typeorm';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { Opcion } from 'src/opciones/entities/opcion.entity';

export const seedPermisos = async (dataSource: DataSource) => {
  const repoPermiso = dataSource.getRepository(Permiso);
  const repoOpcion = dataSource.getRepository(Opcion);

  const existentes = await repoPermiso.count();
  if (existentes > 0) {
    console.log('Permisos ya existen, se omite seeding.');
    return;
  }

  // Obtener todas las opciones
  const opciones = await repoOpcion.find({ relations: ['modulo'] });
  if (opciones.length === 0) {
    console.log('No hay opciones para crear permisos, se omite seeding.');
    return;
  }

  // Tipos de permisos estándar para cada opción
  const tiposPermiso = [
    { sufijo: 'VER', nombre: 'Ver', descripcion: 'Permiso para ver' },
    { sufijo: 'CREAR', nombre: 'Crear', descripcion: 'Permiso para crear' },
    { sufijo: 'EDITAR', nombre: 'Editar', descripcion: 'Permiso para editar' },
    { sufijo: 'ELIMINAR', nombre: 'Eliminar', descripcion: 'Permiso para eliminar' },
  ];

  // Crear permisos para cada opción
  const permisosEntities = [];

  for (const opcion of opciones) {
    // Obtener el nombre base para el código del permiso
    const baseNombre = opcion.nombre.replace('Gestión de ', '').toUpperCase();
    
    for (const tipo of tiposPermiso) {
      const codigo = `${tipo.sufijo}_${baseNombre}`;
      const permiso = repoPermiso.create({
        nombre: `${tipo.nombre} ${opcion.nombre}`,
        descripcion: `${tipo.descripcion} ${opcion.nombre.toLowerCase()}`,
        codigo,
        opcionId: opcion.id,
        activo: true,
      });
      (permisosEntities as Permiso[]).push(permiso);
    }


    if (opcion.nombre.includes('Solicitudes')) {
      const permisosEspecificos = [
        { 
          sufijo: 'APROBAR', 
          nombre: 'Aprobar', 
          descripcion: 'Permiso para aprobar' 
        },
        { 
          sufijo: 'ENTREGAR', 
          nombre: 'Entregar', 
          descripcion: 'Permiso para entregar' 
        },
        { 
          sufijo: 'RECHAZAR', 
          nombre: 'Rechazar', 
          descripcion: 'Permiso para rechazar' 
        },
      ];

      for (const tipo of permisosEspecificos) {
        const codigo = `${tipo.sufijo}_${baseNombre}`;
        const permiso = repoPermiso.create({
          nombre: `${tipo.nombre} ${opcion.nombre}`,
          descripcion: `${tipo.descripcion} ${opcion.nombre.toLowerCase()}`,
          codigo,
          opcionId: opcion.id,
          activo: true,
        });
(permisosEntities as Permiso[]).push(permiso);
      }
    }

    if (opcion.nombre.includes('Materiales')) {
      // Permisos específicos para materiales
      const permisosEspecificos = [
        { 
          sufijo: 'VER_STOCK', 
          nombre: 'Ver Stock', 
          descripcion: 'Permiso para ver el stock' 
        },
      ];

      for (const tipo of permisosEspecificos) {
        const codigo = tipo.sufijo;
        const permiso = repoPermiso.create({
          nombre: `${tipo.nombre} de ${opcion.nombre}`,
          descripcion: `${tipo.descripcion} de ${opcion.nombre.toLowerCase()}`,
          codigo,
          opcionId: opcion.id,
          activo: true,
        });
(permisosEntities as Permiso[]).push(permiso);
      }
    }

    if (opcion.nombre.includes('Movimientos')) {
      // Permisos específicos para movimientos
      const permisosEspecificos = [
        { 
          sufijo: 'FILTRAR', 
          nombre: 'Filtrar', 
          descripcion: 'Permiso para filtrar' 
        },
      ];

      for (const tipo of permisosEspecificos) {
        const codigo = `${tipo.sufijo}_${baseNombre}`;
        const permiso = repoPermiso.create({
          nombre: `${tipo.nombre} ${opcion.nombre}`,
          descripcion: `${tipo.descripcion} ${opcion.nombre.toLowerCase()}`,
          codigo,
          opcionId: opcion.id,
          activo: true,
        });
        (permisosEntities as Permiso[]).push(permiso);
      }
    }
  }

  // Guardar permisos
  await repoPermiso.save(permisosEntities);

  console.log('✔ Permisos insertados correctamente');
  return permisosEntities; 
};