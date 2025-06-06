import { Injectable } from '@nestjs/common';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sede } from './entities/sede.entity';

@Injectable()
export class SedesService {
  constructor(
    @InjectRepository(Sede)
    private readonly sedeRepository: Repository<Sede>,
  ) {}

  async create(data: Partial<Sede>) {
    const nuevo = await this.sedeRepository.save(data);
    return {
      message: 'sede creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.sedeRepository.find({
      relations: [
        'centro',

      ],
    });
    return {
      message: 'Listado de sede',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.sedeRepository.findOne({
      where: { idsede: id },
      relations: [
        'centro',

      ],
    });
    return {
      message: 'sede encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Sede>) {
    await this.sedeRepository.update(id, data);
    const actualizado = await this.sedeRepository.findOneBy({
      idsede: id,
    });
    return {
      message: 'sede actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.sedeRepository.delete(id);
    return {
      message: 'sede eliminado exitosamente',
    };
  }
}
