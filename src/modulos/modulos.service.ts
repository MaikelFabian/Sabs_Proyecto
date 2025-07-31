import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modulo } from './entities/modulo.entity';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Injectable()
export class ModulosService {
  constructor(
    @InjectRepository(Modulo)
    private readonly moduloRepo: Repository<Modulo>,
  ) {}

  async create(dto: CreateModuloDto) {
    const nuevo = this.moduloRepo.create(dto);
    const guardado = await this.moduloRepo.save(nuevo);
    return { message: 'Modulo creado', data: guardado };
  }

  async findAll() {
    const lista = await this.moduloRepo.find({ relations: ['opciones'] });
    return { message: 'Listado de modulos', data: lista };
  }

  async findOne(id: number) {
    const modulo = await this.moduloRepo.findOne({ where: { id }, relations: ['opciones'] });
    if (!modulo) throw new NotFoundException(`Modulo id ${id} no encontrado`);
    return { message: 'Modulo encontrado', data: modulo };
  }

  async update(id: number, dto: UpdateModuloDto) {

    const camposActualizables = ['nombre'];
    const updateData = {};
    
    camposActualizables.forEach(campo => {
      if (dto[campo] !== undefined) {
        updateData[campo] = dto[campo];
      }
    });
    
    await this.moduloRepo.update(id, updateData);
    const actualizado = await this.moduloRepo.findOne({ 
      where: { id }, 
      relations: ['opciones'] 
    });
    return { message: 'Modulo actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.moduloRepo.delete(id);
    return { message: 'Modulo eliminado' };
  }
}
