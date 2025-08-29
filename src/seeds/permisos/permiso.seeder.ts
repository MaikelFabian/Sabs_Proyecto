import { DataSource } from 'typeorm';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { Opcion } from 'src/opciones/entities/opcion.entity';

// Función para normalizar nombres de permisos
const normalizarNombrePermiso = (nombre: string): string => {
  return nombre
    .replace('Gestión de ', '')
    .replace('Gestión de ', '')
    .replace(/[áàäâ]/g, 'A')
    .replace(/[éèëê]/g, 'E')
    .replace(/[íìïî]/g, 'I')
    .replace(/[óòöô]/g, 'O')
    .replace(/[úùüû]/g, 'U')
    .replace(/[ñ]/g, 'N')
    .replace(/\s+/g, '') // Eliminar espacios
    .toUpperCase();
};

// Mapeo manual para casos especiales
const mapeoEspecial: { [key: string]: string } = {
  // Eliminar o comentar estas líneas del mapeoEspecial:
  // CATEGORÍAS: 'CATEGORIASMATERIAL',
  // TIPOSDESITIO: 'TIPOSITIOS',
  // TIPOSDEMATERIAL: 'TIPOMATERIALES',
  // UNIDADESDEMEDIDA: 'UNIDADESMEDIDA',
  // GESTIÓNDECATEGORÍAS: 'CATEGORIASMATERIAL',
  // GESTIÓNDETIPOSDESITIO: 'TIPOSITIOS',
  // GESTIÓNDETIPOSDEMATERIAL: 'TIPOMATERIALES',
  ÁREASPORCENTRO: 'AREACENTROS',
  UNIDADESDEMEDIDA: 'UNIDADESMEDIDA',
  TIPOSDEMATERIAL: 'TIPOMATERIALES',
  TIPOSDESITIO: 'TIPOSITIOS',
  TIPOSDEMOVIMIENTO: 'TIPOMOVIMIENTOS',
  GESTIÓNDECATEGORÍAS: 'CATEGORIASMATERIAL',
  GESTIÓNDETIPOSDESITIO: 'TIPOSITIOS',
  GESTIÓNDETIPOSDEMATERIAL: 'TIPOMATERIALES',
  GESTIÓNDETIPOSDEMOVIMIENTO: 'TIPOMOVIMIENTOS',
};

export const seedPermisos = async (dataSource: DataSource) => {
  const repoPermiso = dataSource.getRepository(Permiso);
  const repoOpcion = dataSource.getRepository(Opcion);
  const existentes = await repoPermiso.count();
  if (existentes > 0) {
    console.log('Permisos ya existen, se omite seeding.');
    return;
  }

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
    {
      sufijo: 'ELIMINAR',
      nombre: 'Eliminar',
      descripcion: 'Permiso para eliminar',
    },
  ];

  // Crear permisos para cada opción
  const permisosEntities = [];

  for (const opcion of opciones) {
    // Normalizar el nombre base para el código del permiso
    let baseNombre = normalizarNombrePermiso(opcion.nombre);

    // Aplicar mapeo especial si existe
    if (mapeoEspecial[baseNombre]) {
      baseNombre = mapeoEspecial[baseNombre];
    }

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
          descripcion: 'Permiso para aprobar',
        },
        {
          sufijo: 'ENTREGAR',
          nombre: 'Entregar',
          descripcion: 'Permiso para entregar',
        },
        {
          sufijo: 'RECHAZAR',
          nombre: 'Rechazar',
          descripcion: 'Permiso para rechazar',
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
          descripcion: 'Permiso para ver el stock',
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
      const permisosEspecificos = [
        {
          sufijo: 'FILTRAR',
          nombre: 'Filtrar',
          descripcion: 'Permiso para filtrar',
        },
        {
          sufijo: 'APROBAR',
          nombre: 'Aprobar',
          descripcion: 'Permiso para aprobar',
        },
        {
          sufijo: 'CREAR_MOVIMIENTO',
          nombre: 'Crear Movimiento',
          descripcion: 'Permiso para crear movimientos',
        },
        {
          sufijo: 'APROBAR_MOVIMIENTOS',
          nombre: 'Aprobar Movimientos',
          descripcion: 'Permiso para aprobar movimientos',
        },
        {
          sufijo: 'VER_MOVIMIENTO',
          nombre: 'Ver Movimiento',
          descripcion: 'Permiso para ver movimiento individual',
        },
      ];

      for (const tipo of permisosEspecificos) {
        // Para los permisos específicos de movimientos, usar el código tal como está
        const codigo = tipo.sufijo.includes('MOVIMIENTO')
          ? tipo.sufijo
          : `${tipo.sufijo}_${baseNombre}`;
        const permiso = repoPermiso.create({
          nombre: `${tipo.nombre}`,
          descripcion: `${tipo.descripcion}`,
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
