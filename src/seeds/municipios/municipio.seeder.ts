import { DataSource } from 'typeorm';
import { Municipio } from 'src/municipios/entities/municipio.entity';

export const seedMunicipio = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Municipio);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Municipios ya existen, se omite seeding.');
    return;
  }

  const municipios = [
    { nombre: 'Neiva' },
    { nombre: 'Pitalito' },
    { nombre: 'Garzón' },
    { nombre: 'La Plata' },
    { nombre: 'Campoalegre' },
    { nombre: 'Algeciras' },
    { nombre: 'Gigante' },
    { nombre: 'San Agustín' },
    { nombre: 'Rivera' },
    { nombre: 'Palermo' },
  ];

  const entities = repo.create(municipios);
  await repo.save(entities);

  console.log('✔ Municipios insertados correctamente');
};