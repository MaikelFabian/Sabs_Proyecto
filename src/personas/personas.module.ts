import { Module } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { PersonaController } from './personas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Persona])],
  providers: [PersonasService],
  controllers: [PersonaController],
  exports: [PersonasService], // <-- Make sure this line is present
})
export class PersonasModule {}
