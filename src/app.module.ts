import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaterialesModule } from './materiales/materiales.module';
import { PersonasModule } from './personas/personas.module';
import { FichasModule } from './fichas/fichas.module';
import { RolesModule } from './roles/roles.module';
import { DetallesModule } from './detalles/detalles.module';
import { TipoMaterialModule } from './tipo-material/tipo-material.module';
import { UnidadMedidaModule } from './unidad-medida/unidad-medida.module';
import { CategoriaMaterialModule } from './categoria-material/categoria-material.module';
import { SedesModule } from './sedes/sedes.module';
import { CentrosModule } from './centros/centros.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { AreasModule } from './areas/areas.module';
import { TituladosModule } from './titulados/titulados.module';
import { SitiosModule } from './sitios/sitios.module';
import { TipoSitioModule } from './tipo-sitio/tipo-sitio.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { TipoMovimientoModule } from './tipo-movimiento/tipo-movimiento.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaCentroModule } from './area-centro/area-centro.module';
import { PermisosModule } from './permisos/permisos.module';
import { AuthModule } from './auth/auth.module';
import { OpcionesModule } from './opciones/opciones.module';
import { ModulosModule } from './modulos/modulos.module';
import { RolPermisoOpcionModule } from './rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      database: process.env.DB_NAME,
      entities: [__dirname + '/*/.entity{.ts,.js}'],
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule, // Agregar aquí
    MaterialesModule,
    PersonasModule,
    FichasModule,
    RolesModule,
    DetallesModule,
    TipoMaterialModule,
    UnidadMedidaModule,
    CategoriaMaterialModule,
    SedesModule,
    CentrosModule,
    MunicipiosModule,
    AreasModule,
    TituladosModule,
    SitiosModule,
    TipoSitioModule,
    MovimientosModule,
    TipoMovimientoModule,
    AreaCentroModule,
    PermisosModule,
    OpcionesModule,
    ModulosModule,
    RolPermisoOpcionModule,
  ],
})
export class AppModule {}
