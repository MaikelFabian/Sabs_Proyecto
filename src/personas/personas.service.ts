import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './entities/persona.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async create(data: Partial<Persona>) {
    // Encriptar la contraseña si viene en el payload
    if (data.contrasena) {
      const salt = bcrypt.genSaltSync(10);
      data.contrasena = bcrypt.hashSync(data.contrasena, salt);
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
      message: 'Persona encontrada',
      data: buscar,
    };
  }

  async findByEmail(email: string) {
    const persona = await this.personaRepository.findOne({
      where: { correo: email },
      relations: [
        'detalles',
        'detalles2',
        'detalles3',
        'movimientos',
        'ficha',
        'rol',
      ],
    });
    return persona;
  }

  async update(id: number, data: Partial<Persona>) {
    // Si actualiza la contraseña, también la encripta
    if (data.contrasena) {
      const salt = bcrypt.genSaltSync(10);
      data.contrasena = bcrypt.hashSync(data.contrasena, salt);
    }

    await this.personaRepository.update(id, data);
    const actualizado = await this.personaRepository.findOneBy({
      idpersona: id,
    });
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
