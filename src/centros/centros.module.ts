import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Centro } from './entities/centro.entity';
import { CentroService } from './centros.service';
import { CentroController } from './centros.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Centro]),RolPermisoOpcionModule],
  controllers: [CentroController],
  providers: [CentroService],
  exports: [CentroService],
})
export class CentroModule {}
