
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
// Cambiar línea 3 de:
// import { PersonasService } from './personas.service'
// A:
import { PersonasService } from './personas.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';

@Controller('personas')
export class PersonaController {
  constructor(private readonly personaService: PersonasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('CREAR_PERSONAS')
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personaService.create(createPersonaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_PERSONAS')
  findAll() {
    return this.personaService.findAll();
  }

  // ✅ MOVIDO: Rutas específicas ANTES de rutas con parámetros
  @Get('completa')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_PERSONAS')
  findAllCompleta() {
    return this.personaService.findPersonaCompleta();
  }

  @Get('completa/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_PERSONAS')
  findOneCompleta(@Param('id') id: string) {
    return this.personaService.findPersonaCompleta(+id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_PERSONAS')
  findOne(@Param('id') id: string) {
    return this.personaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('EDITAR_PERSONAS')
  update(@Param('id') id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personaService.update(+id, updatePersonaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('ELIMINAR_PERSONAS')
  remove(@Param('id') id: string) {
    return this.personaService.remove(+id);
  }
}
