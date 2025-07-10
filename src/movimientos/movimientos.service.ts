import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { Repository } from 'typeorm';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Material } from 'src/materiales/entities/materiale.entity';
import { TipoMovimiento } from '../tipo-movimiento/entities/tipo-movimiento.entity';

@Injectable()
export class MovimientoService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepository: Repository<TipoMovimiento>,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto) {
    const { materialId, tipoMovimientoId, cantidad } = createMovimientoDto;

    const material = await this.materialRepository.findOne({ where: { id: materialId } });
    if (!material) throw new BadRequestException('Material no encontrado');

    const tipoMovimiento = await this.tipoMovimientoRepository.findOne({ where: { id: tipoMovimientoId } });
    if (!tipoMovimiento) throw new BadRequestException('Tipo de movimiento no encontrado');

    let nuevoStock = material.stock;
    if (tipoMovimiento.nombre.toLowerCase() === 'entrada') {
      nuevoStock += cantidad;
    } else if (tipoMovimiento.nombre.toLowerCase() === 'salida') {
      if (material.stock < cantidad) {
        throw new BadRequestException('Stock insuficiente para salida');
      }
      nuevoStock -= cantidad;
    } else {
      throw new BadRequestException('Tipo de movimiento desconocido');
    }

    material.stock = nuevoStock;
    await this.materialRepository.save(material);

    const movimiento = this.movimientoRepository.create({
      ...createMovimientoDto,
      material,
      tipoMovimiento,
    });

    return this.movimientoRepository.save(movimiento);
  }

  async findAll() {
    return this.movimientoRepository.find({
      relations: ['material', 'tipoMovimiento'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.movimientoRepository.findOne({
      where: { id },
      relations: ['material', 'tipoMovimiento'],
    });
  }



  async update(id: number, dto: UpdateMovimientoDto) {
    await this.movimientoRepository.update(id, dto);
const actualizado = await this.movimientoRepository.findOne({
  where: { id },
  relations: ['material', 'tipoMovimiento'],
});
return actualizado;
  }

  async remove(id: number) {
   await this.movimientoRepository.delete(id);
return { message: 'Movimiento eliminado correctamente' };
  }
}
