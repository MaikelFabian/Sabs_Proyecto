import { DataSource } from 'typeorm';
import { Sitio } from 'src/sitios/entities/sitio.entity';
import { TipoSitio } from 'src/tipo-sitio/entities/tipo-sitio.entity';

export const seedSitios = async (dataSource: DataSource) => {
  const sitioRepo = dataSource.getRepository(Sitio);
  const tipoSitioRepo = dataSource.getRepository(TipoSitio);

  const existentes = await sitioRepo.count();
  if (existentes > 0) {
    console.log('Sitios ya existen, se omite seeding.');
    return;
  }

  // Obtener tipos de sitio
  const tipoBodega = await tipoSitioRepo.findOne({ where: { nombre: 'Bodegas' } });
  const tipoAmbiente = await tipoSitioRepo.findOne({ where: { nombre: 'Ambientes' } });

  const sitios = [
    // Bodegas
    { nombre: 'Bodega TICS', tipoSitioId: tipoBodega?.id },
    { nombre: 'PAE', tipoSitioId: tipoBodega?.id },
    { nombre: 'GASTRONOMIA', tipoSitioId: tipoBodega?.id },
    { nombre: 'CAFE', tipoSitioId: tipoBodega?.id },
    { nombre: 'DIBUJO ARQUITECTONICO', tipoSitioId: tipoBodega?.id },
    
    // Ambientes Y1 al Y24
    ...Array.from({ length: 24 }, (_, i) => ({
      nombre: `Y${i + 1}`,
      tipoSitioId: tipoAmbiente?.id
    }))
  ];

  const entities = sitioRepo.create(sitios);
  await sitioRepo.save(entities);

  console.log('✔ Sitios insertados correctamente');
};