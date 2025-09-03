import { DataSource } from 'typeorm';
import { CategoriaMaterial } from 'src/categoria-material/entities/categoria-material.entity';

export const seedCategoriaMaterial = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(CategoriaMaterial);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Categorías de material ya existen, se omite seeding.');
    return;
  }

  const categorias = [
    { categoria: 'Herramientas' },
    { categoria: 'Consumibles' },
    { categoria: 'Equipos' },
    { categoria: 'Materiales de Construcción' },
    { categoria: 'Electrónicos' },
  ];

  const entities = repo.create(categorias);
  await repo.save(entities);

  console.log('✔ Categorías de material insertadas correctamente');
};