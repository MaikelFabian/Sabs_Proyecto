import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { StockMovimiento } from './entities/stock-movimiento.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity'; // Agregar import
import { StockService } from './stock.service';
import { StockSelectionService } from './stock-selection.service';
import { StockController } from './stock.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stock, 
      StockMovimiento, 
      Material,
      Sitio // Agregar Sitio
    ]),
    RolPermisoOpcionModule
  ],
  controllers: [StockController],
  providers: [StockService, StockSelectionService, PermisosGuard],
  exports: [StockService, StockSelectionService],
})
export class StockModule {}