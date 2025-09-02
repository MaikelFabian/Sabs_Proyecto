import { Injectable } from '@nestjs/common';
import { CreateGatoDto } from './dto/create-gato.dto';
import { UpdateGatoDto } from './dto/update-gato.dto';

@Injectable()
export class GatosService {
  create(createGatoDto: CreateGatoDto) {
    return 'This action adds a new gato';
  }

  findAll() {
    return `This action returns all gatos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gato`;
  }

  update(id: number, updateGatoDto: UpdateGatoDto) {
    return `This action updates a #${id} gato`;
  }

  remove(id: number) {
    return `This action removes a #${id} gato`;
  }
}
