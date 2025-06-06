import { Injectable } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './entities/persona.entity';


@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async create(data: Partial<Persona>) {
    const nuevo = await this.personaRepository.save(data);
    return {
      message: 'Persona creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.personaRepository.find({
      relations: [
        'detalles',
        'detalles2',
        'detalles3',
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
      where: { idpersona: id },
      relations: [
        'detalles',
        'detalles2',
        'detalles3',
        'movimientos',
        'ficha',
        'rol',

      ],
    });
    return {
      message: 'municipio encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Persona>) {
    await this.personaRepository.update(id, data);
    const actualizado = await this.personaRepository.findOneBy({
      idpersona: id,
    });
    return {
      message: 'persona actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.personaRepository.delete(id);
    return {
      message: 'persona eliminado exitosamente',
    };
  }
}

