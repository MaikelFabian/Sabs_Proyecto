import { Injectable } from '@nestjs/common';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Movimiento } from './entities/movimiento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
  ) {}

  async create(data: Partial<Movimiento>) {
    const nuevo = await this.movimientoRepository.save(data);
    return {
      message: 'material creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.movimientoRepository.find({
      relations: [
        'movimientopersona',
        'tipomovimiento',
      ],
    });
    return {
      message: 'Listado de movimientos',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.movimientoRepository.findOne({
      where: { idmovimiento: id },
      relations: [
        'movimientopersona',
        'tipomovimiento',

      ],
    });
    return {
      message: 'movimiento encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Movimiento>) {
    await this.movimientoRepository.update(id, data);
    const actualizado = await this.movimientoRepository.findOneBy({
      idmovimiento: id,
    });
    return {
      message: 'movimiento actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.movimientoRepository.delete(id);
    return {
      message: 'movimiento eliminado exitosamente',
    };
  }
}