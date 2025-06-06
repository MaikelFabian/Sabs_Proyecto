import { Module } from '@nestjs/common';
import { SitiosService } from './sitios.service';
import { SitiosController } from './sitios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sitio } from './entities/sitio.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Sitio])],
  controllers: [SitiosController],
  providers: [SitiosService],
})
export class SitiosModule {}
