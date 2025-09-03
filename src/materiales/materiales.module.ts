// src/material/material.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialService } from './materiales.service';
import { MaterialController } from './materiales.controller';
import { Material } from './entities/materiale.entity';
import { Movimiento } from '../movimientos/entities/movimiento.entity';
import { Detalle } from '../detalles/entities/detalle.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Sitio } from '../sitios/entities/sitio.entity'; // Agregar import
import { StockModule } from '../stock/stock.module';
import { RolPermisoOpcionModule } from '../rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Material, 
      Movimiento, 
      Detalle, 
      Stock, 
      Persona,
      Sitio // Agregar Sitio
    ]),
    StockModule,
    RolPermisoOpcionModule // Agregar esta línea
  ],
  controllers: [MaterialController],
  providers: [MaterialService],
  exports: [MaterialService]
})
export class MaterialesModule {}
