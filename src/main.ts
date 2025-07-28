import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { seedTipoMovimiento } from './seeds/tipo-movimientos/tipo-movimiento.seeder';
import { seedModulos } from './seeds/modulos/modulo.seeder';
import { seedOpciones } from './seeds/opciones/opcion.seeder';
import { seedPermisos } from './seeds/permisos/permiso.seeder';
import { seedRoles } from './seeds/roles/rol.seeder';
import { seedRolPermisoOpcion } from './seeds/rol-permiso-opcion/rol-permiso-opcion.seeder';
import { seedPersona } from './seeds/personas/persona.seeder';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource); 
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Ejecutar seeds en orden
  await seedTipoMovimiento(dataSource);
  await seedModulos(dataSource);
  await seedOpciones(dataSource);
  await seedPermisos(dataSource);
  await seedRoles(dataSource);
  await seedRolPermisoOpcion(dataSource);
  await seedPersona(dataSource);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
