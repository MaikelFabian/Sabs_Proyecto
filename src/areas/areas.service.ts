
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly repo: Repository<Area>,
  ) {}

  async create(dto: CreateAreaDto) {
    const nueva = this.repo.create({ ...dto });
    const guardada = await this.repo.save(nueva);
    return { message: 'Área creada', data: guardada };
  }

  async findAll() {
    const lista = await this.repo.find({
      relations: ['areasCentro', 'titulados'],
    });
    return { message: 'Listado de áreas', data: lista };
  }

  async findOne(id: number) {
    const area = await this.repo.findOne({
      where: { id },
      relations: ['areasCentro', 'titulados'],
    });
    if (!area) throw new NotFoundException(`Área no encontrada id: ${id}`);
    return { message: 'Área encontrada', data: area };
  }

  async update(id: number, dto: UpdateAreaDto) {
    const camposActualizables = ['nombre', 'activo'];
    const updateData = {};

    camposActualizables.forEach((campo) => {
      if (dto[campo] !== undefined) {
        updateData[campo] = dto[campo];
      }
    });

    const areaExistente = await this.repo.findOne({ where: { id } });
    if (!areaExistente) {
      throw new NotFoundException(`Área no encontrada id: ${id}`);
    }

    if (Object.keys(updateData).length > 0) {
      await this.repo.update(id, updateData);
    }

    const actualizada = await this.repo.findOne({
      where: { id },
      relations: ['areasCentro', 'titulados'],
    });

    return { message: 'Área actualizada', data: actualizada };
  }

  async remove(id: number) {
    // 1. Verificar que el área existe y cargar sus relaciones
    const area = await this.repo.findOne({
      where: { id },
      relations: ['areasCentro', 'titulados']
    });
    
    if (!area) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }
  
    // 2. Verificar si tiene relaciones en area_centro
    if (area.areasCentro && area.areasCentro.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el área "${area.nombre}" porque tiene ${area.areasCentro.length} relación(es) con centro(s). ` +
        'Elimine primero las relaciones área-centro asociadas.'
      );
    }
  
    // 3. Verificar si tiene titulados asociados
    if (area.titulados && area.titulados.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el área "${area.nombre}" porque tiene ${area.titulados.length} titulado(s) asociado(s). ` +
        'Elimine primero los titulados relacionados.'
      );
    }
  
    // 4. Si no hay elementos asociados, proceder con la eliminación
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }
    
    return { message: `Área "${area.nombre}" eliminada exitosamente` };
  }
}
