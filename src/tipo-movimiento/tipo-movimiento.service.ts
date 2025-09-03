import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoMovimiento } from './entities/tipo-movimiento.entity';
import { CreateTipoMovimientoDto } from './dto/create-tipo-movimiento.dto';
import { UpdateTipoMovimientoDto } from './dto/update-tipo-movimiento.dto';

@Injectable()
export class TipoMovimientoService {
  constructor(
    @InjectRepository(TipoMovimiento)
    private readonly repo: Repository<TipoMovimiento>,
  ) {}

  async create(dto: CreateTipoMovimientoDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'TipoMovimiento creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['movimientos'] });
    return { message: 'Listado de tipos de movimiento', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({
      where: { id },
      relations: ['movimientos'],
    });
    if (!encontrado)
      throw new NotFoundException(`TipoMovimiento no encontrado id: ${id}`);
    return { message: 'TipoMovimiento encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateTipoMovimientoDto) {
    const { movimientos, ...updateData } = dto as any;
    
    await this.repo.update(id, updateData);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ['movimientos'],
    });
    return { message: 'TipoMovimiento actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'TipoMovimiento eliminado' };
  }
}
