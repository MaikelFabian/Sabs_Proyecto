import { DataSource } from 'typeorm';
import { Modulo } from 'src/modulos/entities/modulo.entity';

export const seedModulos = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Modulo);

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
    { nombre: 'Sitios' },
    { nombre: 'Municipios' },
    { nombre: 'Categoría Material' },
    { nombre: 'Tipo Sitio' },
    { nombre: 'Tipo Material' },
    { nombre: 'Unidad Medida' },
  ];

  // Crear solo los módulos que no existen
  for (const moduloData of modulos) {
    const existeModulo = await repo.findOne({ where: { nombre: moduloData.nombre } });
    if (!existeModulo) {
      const modulo = repo.create(moduloData);
      await repo.save(modulo);
      console.log(`✔ Módulo '${moduloData.nombre}' creado`);
    }
  }

  console.log('✔ Módulos verificados/creados correctamente');
};