import { DataSource } from 'typeorm';
import { TipoMaterial } from 'src/tipo-material/entities/tipo-material.entity';

export const seedTipoMaterial = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(TipoMaterial);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Tipos de material ya existen, se omite seeding.');
    return;
  }

  const tipos = [
    { tipo: 'Metal' },
    { tipo: 'Plástico' },
    { tipo: 'Eléctrico' },
    { tipo: 'Textil' },
    { tipo: 'Químico' },
  ];

  const entities = repo.create(tipos);
  await repo.save(entities);

  console.log('✔ Tipos de material insertados correctamente');
};