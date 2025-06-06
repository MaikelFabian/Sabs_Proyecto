import { Module } from '@nestjs/common';
import { UnidadMedidaService } from './unidad-medida.service';
import { UnidadMedidaController } from './unidad-medida.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidadmedida } from './entities/unidad-medida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Unidadmedida])],
  controllers: [UnidadMedidaController],
  providers: [UnidadMedidaService],
  exports: [TypeOrmModule]
})
export class UnidadMedidaModule {}
