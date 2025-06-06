import { Injectable } from '@nestjs/common';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';
import { Ficha } from './entities/ficha.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';




@Injectable()
export class FichasService {
  constructor(
    @InjectRepository(Ficha)
    private readonly fichaRepository: Repository<Ficha>,
  ) {}

  async create(data: Partial<Ficha>) {
    const nuevo = await this.fichaRepository.save(data);
    return {
      message: 'ficha creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.fichaRepository.find({
      relations: [
        'personas',
        'titulados',

      ],
    });
    return {
      message: 'lista de fichas',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.fichaRepository.findOne({
      where: { idficha: id },
      relations: [
        'personas',
        'titulados',
      ],
    });
    return {
      message: 'ficha encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Ficha>) {
    await this.fichaRepository.update(id, data);
    const actualizado = await this.fichaRepository.findOneBy({
      idficha: id,
    });
    return {
      message: 'ficha actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.fichaRepository.delete(id);
    return {
      message: 'ficha eliminado exitosamente',
    };
  }
}
