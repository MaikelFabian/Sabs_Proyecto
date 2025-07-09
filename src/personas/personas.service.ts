// src/personas/personas.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './entities/persona.entity';
import * as bcrypt from 'bcryptjs';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async create(data: Partial<Persona>) {
  if (data.contrasena) {
    const salt = bcrypt.genSaltSync(10);
    data.contrasena = bcrypt.hashSync(data.contrasena, salt);
  }

  if (data.rolId) {
    data.rol = { id: data.rolId } as any;
  }

  if (data.fichaId) {
    data.ficha = { id: data.fichaId } as any;
  }

  const nuevo = await this.personaRepository.save(data);
  return {
    message: 'Persona creada exitosamente',
    data: nuevo,
  };
}

  async findAll() {
    const listar = await this.personaRepository.find({
      relations: [
        'encargos',
        'solicitudes',
        'aprobaciones',
        'movimientos',
        'ficha',
        'rol',
      ],
    });
    return {
      message: 'Listado de personas',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.personaRepository.findOne({
      where: { id },
      relations: [
        'encargos',
        'solicitudes',
        'aprobaciones',
        'movimientos',
        'ficha',
        'rol',
      ],
    });
    return {
      message: 'Persona encontrada',
      data: buscar,
    };
  }
 
async findByEmail(email: string) {
  const persona = await this.personaRepository.findOne({
    where: { correo: email },
    relations: [
      'rol',
      'rol.rolesPermisosOpciones',
      'rol.rolesPermisosOpciones.permiso',
      'rol.rolesPermisosOpciones.opcion',
      'rol.rolesPermisosOpciones.opcion.modulo',
    ],
  });
  return persona;
}


  async update(id: number, data: UpdatePersonaDto) {
    if (data.contrasena) {
      data.contrasena = await bcrypt.hash(data.contrasena, 10);
    }

    await this.personaRepository.update(id, data);
    const actualizado = await this.personaRepository.findOneBy({ id });
    return {
      message: 'Persona actualizada exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.personaRepository.delete(id);
    return {
      message: 'Persona eliminada exitosamente',
    };
  }
}
