import { Module } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { PersonaController } from './personas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Persona]),RolPermisoOpcionModule],
  providers: [PersonasService],
  controllers: [PersonaController],
  exports: [PersonasService], 
})
export class PersonasModule {}
