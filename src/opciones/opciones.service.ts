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
    const camposActualizables = ['nombre', 'descripcion', 'rutaFrontend', 'moduloId'];
    const updateData = {};
    
    camposActualizables.forEach(campo => {
      if (dto[campo] !== undefined) {
        updateData[campo] = dto[campo];
      }
    });
    
    const opcionExistente = await this.opcionRepo.findOne({ where: { id } });
    if (!opcionExistente) {
      throw new NotFoundException(`Opcion id ${id} no encontrada`);
    }
    
    if (Object.keys(updateData).length > 0) {
      await this.opcionRepo.update(id, updateData);
    }
    
    const actualizada = await this.opcionRepo.findOne({
      where: { id },
      relations: ['modulo', 'permisos']
    });
    
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
