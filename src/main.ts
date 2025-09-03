import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { seedTipoMovimiento } from './seeds/tipo-movimientos/tipo-movimiento.seeder';
import { seedTipoMaterial } from './seeds/tipo-material/tipo-material.seeder';
import { seedMunicipio } from './seeds/municipios/municipio.seeder';
import { seedCategoriaMaterial } from './seeds/categoria-material/categoria-material.seeder';
import { seedModulos } from './seeds/modulos/modulo.seeder';
import { seedOpciones } from './seeds/opciones/opcion.seeder';
import { seedPermisos } from './seeds/permisos/permiso.seeder';
import { seedRoles } from './seeds/roles/rol.seeder';
import { seedRolPermisoOpcion } from './seeds/rol-permiso-opcion/rol-permiso-opcion.seeder';
import { seedPersona } from './seeds/personas/persona.seeder';
import { seedTipoSitio } from './seeds/tipo-sitio/tipo-sitio.seeder';
import { seedSitios } from './seeds/sitios/sitio.seeder';
import { seedUnidadMedida } from './seeds/unidad-medida/unidad-medida.seeder';
import { DataSource } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  const dataSource = app.get(DataSource);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'Expires',
    ],
  });
  // ELIMINAR la segunda configuración CORS duplicada (líneas 30-34)
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
  });

  await seedTipoMovimiento(dataSource);
  await seedModulos(dataSource);
  await seedOpciones(dataSource);
  await seedPermisos(dataSource);
  await seedRoles(dataSource);
  await seedRolPermisoOpcion(dataSource);
  await seedPersona(dataSource);
  await seedTipoMaterial(dataSource);
  await seedMunicipio(dataSource);
  await seedCategoriaMaterial(dataSource);
  await seedUnidadMedida(dataSource);
  await seedTipoSitio(dataSource);
  await seedSitios(dataSource);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
