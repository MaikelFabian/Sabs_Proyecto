import { DataSource } from 'typeorm';
import { TipoSitio } from 'src/tipo-sitio/entities/tipo-sitio.entity';

export const seedTipoSitio = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(TipoSitio);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Tipos de sitio ya existen, se omite seeding.');
    return;
  }

  const tiposSitio = [
    { nombre: 'Bodegas' },
    { nombre: 'Ambientes' },
  ];

  const entities = repo.create(tiposSitio);
  await repo.save(entities);

  console.log('✔ Tipos de sitio insertados correctamente');
};