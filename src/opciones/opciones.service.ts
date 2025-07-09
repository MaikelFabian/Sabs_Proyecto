import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opcion } from './entities/opcion.entity';
import { CreateOpcionDto } from './dto/create-opcione.dto';
import { UpdateOpcionDto } from './dto/update-opcione.dto';

@Injectable()
export class OpcionesService {
  constructor(
    @InjectRepository(Opcion)
    private readonly opcionRepo: Repository<Opcion>,
  ) {}

  async create(dto: CreateOpcionDto) {
    const nueva = this.opcionRepo.create(dto);
    const guardada = await this.opcionRepo.save(nueva);
    return { message: 'Opcion creada', data: guardada };
  }

  async findAll() {
    const lista = await this.opcionRepo.find({ relations: ['modulo', 'permisos'] });
    return { message: 'Listado de opciones', data: lista };
  }

  async findOne(id: number) {
    const opcion = await this.opcionRepo.findOne({ where: { id }, relations: ['modulo', 'permisos'] });
    if (!opcion) throw new NotFoundException(`Opcion id ${id} no encontrada`);
    return { message: 'Opcion encontrada', data: opcion };
  }

  async update(id: number, dto: UpdateOpcionDto) {
    await this.opcionRepo.update(id, dto);
    const actualizada = await this.opcionRepo.findOneBy({ id });
    return { message: 'Opcion actualizada', data: actualizada };
  }

  async remove(id: number) {
    await this.opcionRepo.delete(id);
    return { message: 'Opcion eliminada' };
  }
async getAllWithPermisos() {
    const data = await this.opcionRepo.find({
      relations: ['permisos'],
    });
    return {
      message: 'Opciones con sus permisos',
      data,
    };
  }

}
