import { DataSource } from 'typeorm';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';

export const seedTipoMovimiento = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(TipoMovimiento);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Tipos de movimiento ya existen, se omite seeding.');
    return;
  }

  const entrada = repo.create({ nombre: 'ENTRADA' });
  const salida = repo.create({ nombre: 'SALIDA' });
  const devolucion = repo.create({ nombre: 'DEVOLUCION' });
  const prestamo = repo.create({ nombre: 'PRESTAMO' }); 

  await repo.save([entrada, salida, devolucion, prestamo]); 

  console.log('✔ Tipos de movimiento insertados correctamente');
};
