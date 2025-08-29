// src/detalles/detalles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detalles } from './entities/detalle.entity';
import { DetallesService } from './detalles.service';
import { DetallesController } from './detalles.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Detalles,
      Movimiento,
      Material,
      TipoMovimiento, 
    ]),
    RolPermisoOpcionModule
  ],
  controllers: [DetallesController],
  providers: [DetallesService],
  exports: [DetallesService],
})
export class DetallesModule {}
