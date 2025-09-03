import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule'; 
import { MaterialesModule } from './materiales/materiales.module'; 
import { PersonasModule } from './personas/personas.module';
import { FichaModule } from './fichas/fichas.module';
import { RolesModule } from './roles/roles.module';
import { DetallesModule } from './detalles/detalles.module';
import { StockModule } from './stock/stock.module';
import { TipoMaterialModule } from './tipo-material/tipo-material.module';
import { UnidadMedidaModule } from './unidad-medida/unidad-medida.module';
import { CategoriaMaterialModule } from './categoria-material/categoria-material.module';
import { SedeModule } from './sedes/sedes.module';
import { CentroModule } from './centros/centros.module';
import { MunicipioModule } from './municipios/municipios.module';
import { AreaModule } from './areas/areas.module';
import { TituladoModule } from './titulados/titulados.module';
import { SitioModule } from './sitios/sitios.module';
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
import { NotificacionesModule } from './notificaciones/notificaciones.module'; 
import { GatosModule } from './gatos/gatos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      migrations: ['src/migrations/*{.ts,.js}'],
      migrationsRun: process.env.NODE_ENV === 'production',
    }),
    AuthModule,
    MaterialesModule, // ✅ Cambiado de MaterialModule a MaterialesModule
    PersonasModule,
    FichaModule,
    RolesModule,
    DetallesModule,
    TipoMaterialModule,
    UnidadMedidaModule,
    CategoriaMaterialModule,
    SedeModule,
    CentroModule,
    MunicipioModule,
    AreaModule,
    TituladoModule,
    StockModule,
    SitioModule,
    TipoSitioModule,
    MovimientosModule, 
    TipoMovimientoModule,
    AreaCentroModule,
    PermisosModule,
    OpcionesModule,
    ModulosModule,
    RolPermisoOpcionModule,
    NotificacionesModule,
    GatosModule, 
  ],
})
export class AppModule {}
