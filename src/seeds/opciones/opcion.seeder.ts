import { DataSource } from 'typeorm';
import { Opcion } from 'src/opciones/entities/opcion.entity';
import { Modulo } from 'src/modulos/entities/modulo.entity';

export const seedOpciones = async (dataSource: DataSource) => {
  const repoOpcion = dataSource.getRepository(Opcion);
  const repoModulo = dataSource.getRepository(Modulo);

  const existentes = await repoOpcion.count();
  if (existentes > 0) {
    console.log('Opciones ya existen, se omite seeding.');
    return;
  }

  // Obtener todos los módulos
  const modulos = await repoModulo.find();
  if (modulos.length === 0) {
    console.log('No hay módulos para crear opciones, se omite seeding.');
    return;
  }

  const modulosPorNombre = modulos.reduce((acc, modulo) => {
    acc[modulo.nombre] = modulo;
    return acc;
  }, {});

  const opcionesPorModulo = [
    {
      modulo: 'Materiales',
      opciones: [
        { nombre: 'Gestión de Materiales', descripcion: 'Administrar materiales', rutaFrontend: '/materiales' },
        { nombre: 'Gestión de Stock', descripcion: 'Administrar stock de materiales', rutaFrontend: '/stock' },
      ],
    },
    {
      modulo: 'Sedes',
      opciones: [
        { nombre: 'Gestión de Sedes', descripcion: 'Administrar sedes', rutaFrontend: '/sedes' },
      ],
    },
    {
      modulo: 'Centros',
      opciones: [
        { nombre: 'Gestión de Centros', descripcion: 'Administrar centros', rutaFrontend: '/centros' },
      ],
    },
    {
      modulo: 'Áreas',
      opciones: [
        { nombre: 'Gestión de Áreas', descripcion: 'Administrar áreas', rutaFrontend: '/areas' },
        { nombre: 'Áreas por Centro', descripcion: 'Administrar áreas por centro', rutaFrontend: '/areacentros' },
      ],
    },
    {
      modulo: 'Titulados',
      opciones: [
        { nombre: 'Gestión de Titulados', descripcion: 'Administrar titulados', rutaFrontend: '/titulados' },
      ],
    },
    {
      modulo: 'Fichas',
      opciones: [
        { nombre: 'Gestión de Fichas', descripcion: 'Administrar fichas', rutaFrontend: '/fichas' },
      ],
    },
    {
      modulo: 'Movimientos',
      opciones: [
        { nombre: 'Gestión de Movimientos', descripcion: 'Administrar movimientos', rutaFrontend: '/movimientos' },
        { nombre: 'Tipos de Movimiento', descripcion: 'Administrar tipos de movimiento', rutaFrontend: '/tipomovimientos' },
        { nombre: 'Detalles de Movimiento', descripcion: 'Ver detalles de movimientos', rutaFrontend: '/detalles' },
      ],
    },
    {
      modulo: 'Usuarios',
      opciones: [
        { nombre: 'Gestión de Usuarios', descripcion: 'Administrar usuarios', rutaFrontend: '/usuarios' },
      ],
    },
    {
      modulo: 'Roles',
      opciones: [
        { nombre: 'Gestión de Roles', descripcion: 'Administrar roles', rutaFrontend: '/roles' },
      ],
    },
    {
      modulo: 'Permisos',
      opciones: [
        { nombre: 'Gestión de Permisos', descripcion: 'Administrar permisos', rutaFrontend: '/permisos' },
        { nombre: 'Asignación de Permisos', descripcion: 'Asignar permisos a roles', rutaFrontend: '/asignarpermisos' },
      ],
    },
    {
      modulo: 'Sitios',
      opciones: [
        { nombre: 'Gestión de Sitios', descripcion: 'Administrar sitios', rutaFrontend: '/sitios' },
      ],
    },
    {
      modulo: 'Municipios',
      opciones: [
        { nombre: 'Gestión de Municipios', descripcion: 'Administrar municipios', rutaFrontend: '/municipios' },
      ],
    },
    // NUEVAS OPCIONES AÑADIDAS
    {
      modulo: 'Unidad Medida',
      opciones: [
        { nombre: 'Gestión de Unidades de Medida', descripcion: 'Administrar unidades de medida', rutaFrontend: '/unidad-medida' },
      ],
    },
    {
      modulo: 'Categoría Material',
      opciones: [
        { nombre: 'Gestión de Categorías de Material', descripcion: 'Administrar categorías de material', rutaFrontend: '/categoria-material' },
      ],
    },
    {
      modulo: 'Tipo Material',
      opciones: [
        { nombre: 'Gestión de Tipos de Material', descripcion: 'Administrar tipos de material', rutaFrontend: '/tipo-material' },
      ],
    },
    {
      modulo: 'Gráficos',
      opciones: [
        { nombre: 'Ver Gráficos', descripcion: 'Visualizar gráficos y estadísticas', rutaFrontend: '/graficos' },
        { nombre: 'Exportar Gráficos', descripcion: 'Exportar gráficos en diferentes formatos', rutaFrontend: '/graficos' },
      ],
    },
    {
      modulo: 'Notificaciones',
      opciones: [
        { nombre: 'Ver Notificaciones', descripcion: 'Visualizar notificaciones del sistema', rutaFrontend: '/notificaciones' },
        { nombre: 'Gestionar Notificaciones', descripcion: 'Administrar notificaciones', rutaFrontend: '/notificaciones' },
        { nombre: 'Marcar como Leída', descripcion: 'Marcar notificaciones como leídas', rutaFrontend: '/notificaciones' },
      ],
    },
    {
      modulo: 'Reportes',
      opciones: [
        { nombre: 'Generar Reportes', descripcion: 'Generar reportes del sistema', rutaFrontend: '/reportes' },
        { nombre: 'Ver Reportes', descripcion: 'Visualizar reportes generados', rutaFrontend: '/reportes' },
        { nombre: 'Exportar Reportes', descripcion: 'Exportar reportes en diferentes formatos', rutaFrontend: '/reportes' },
      ],
    },
    {
      modulo: 'Inventario',
      opciones: [
        { nombre: 'Gestión de Inventario', descripcion: 'Administrar inventario general', rutaFrontend: '/gestion-inventario' },
        { nombre: 'Ver Estado Inventario', descripcion: 'Visualizar estado del inventario', rutaFrontend: '/gestion-inventario' },
      ],
    },
    {
      modulo: 'Bodega',
      opciones: [
        { nombre: 'Gestión de Bodegas', descripcion: 'Administrar bodegas', rutaFrontend: '/bodega' },
        { nombre: 'Ver Sitios por Tipo', descripcion: 'Visualizar sitios por tipo de bodega', rutaFrontend: '/bodega/tipo' },
        { nombre: 'Ver Materiales por Sitio', descripcion: 'Visualizar materiales por sitio', rutaFrontend: '/bodega/sitio' },
      ],
    },
    {
      modulo: 'Dashboard',
      opciones: [
        { nombre: 'Ver Dashboard', descripcion: 'Acceder al panel principal', rutaFrontend: '/' },
        { nombre: 'Ver Estadísticas Generales', descripcion: 'Visualizar estadísticas del dashboard', rutaFrontend: '/' },
      ],
    },
    {
      modulo: 'Personas',
      opciones: [
        { nombre: 'Gestión de Personas', descripcion: 'Administrar personas del sistema', rutaFrontend: '/personas' },
      ],
    },
  ];

  const opcionesEntities = [];

  for (const { modulo, opciones } of opcionesPorModulo) {
    const moduloEntity = modulosPorNombre[modulo];
    if (!moduloEntity) continue;

    for (const opcion of opciones) {
      const opcionEntity = repoOpcion.create({
        ...opcion,
        moduloId: moduloEntity.id,
      });
      (opcionesEntities as Opcion[]).push(opcionEntity);
    }
  }

  // Guardar opciones
  await repoOpcion.save(opcionesEntities);

  console.log('✔ Opciones insertadas correctamente');
  return opcionesEntities; // Retornar para usar en otros seeders
};