import { DataSource } from 'typeorm';
import { UnidadMedida } from 'src/unidad-medida/entities/unidad-medida.entity';

export const seedUnidadMedida = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(UnidadMedida);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Unidades de medida ya existen, se omite seeding.');
    return;
  }

  const unidades = [
    { unidad: 'Unidad', simbolo: 'und' },
    { unidad: 'Metro', simbolo: 'm' },
    { unidad: 'Litro', simbolo: 'L' },
    { unidad: 'Kilogramo', simbolo: 'kg' },
    { unidad: 'Paquete', simbolo: 'paq' },
  ];

  const entities = repo.create(unidades);
  await repo.save(entities);

  console.log('✔ Unidades de medida insertadas correctamente');
};