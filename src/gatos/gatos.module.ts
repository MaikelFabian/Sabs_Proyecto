import { Module } from '@nestjs/common';
import { GatosService } from './gatos.service';
import { GatosController } from './gatos.controller';

@Module({
  controllers: [GatosController],
  providers: [GatosService],
})
export class GatosModule {}
