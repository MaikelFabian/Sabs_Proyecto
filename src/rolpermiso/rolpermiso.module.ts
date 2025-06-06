import { Module } from '@nestjs/common';
import { RolpermisoService } from './rolpermiso.service';
import { RolpermisoController } from './rolpermiso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rolpermiso } from './entities/rolpermiso.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Rolpermiso])],
  controllers: [RolpermisoController],
  providers: [RolpermisoService],
})
export class RolpermisoModule {}
