import { Injectable } from '@nestjs/common';
import { CreateTipoMovimientoDto } from './dto/create-tipo-movimiento.dto';
import { UpdateTipoMovimientoDto } from './dto/update-tipo-movimiento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tipomovimiento } from './entities/tipo-movimiento.entity';


@Injectable()
export class TipoMovimientoService {
  constructor(
    @InjectRepository(Tipomovimiento)
    private readonly tipoMovimientoRepository: Repository<Tipomovimiento>,
  ) {}

  async create(data: Partial<Tipomovimiento>) {
    const nuevo = await this.tipoMovimientoRepository.save(data);
    return {
      message: 'tipo de movimiento creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.tipoMovimientoRepository.find({
      relations: [
        'movimientos',

      ],
    });
    return {
      message: 'Listado de tipo de movimiento',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.tipoMovimientoRepository.findOne({
      where: { idtipomovimiento: id },
      relations: [
        'movimientos',

      ],
    });
    return {
      message: 'munictipo de movimientoipio encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Tipomovimiento>) {
    await this.tipoMovimientoRepository.update(id, data);
    const actualizado = await this.tipoMovimientoRepository.findOneBy({
      idtipomovimiento: id,
    });
    return {
      message: 'tipo de movimiento actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.tipoMovimientoRepository.delete(id);
    return {
      message: 'tipo de movimiento eliminado exitosamente',
    };
  }
}
