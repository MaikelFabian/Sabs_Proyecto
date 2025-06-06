import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';

@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Post()
  create(@Body() data:Partial<Persona>) {
    return this.personasService.create(data);
  }

  @Get()
  findAll() {
    return this.personasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Persona>) {
    return this.personasService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personasService.remove(+id);
  }
}
