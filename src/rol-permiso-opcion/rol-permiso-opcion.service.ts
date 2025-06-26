import { Injectable } from '@nestjs/common';
import { CreateRolPermisoOpcionDto } from './dto/create-rol-permiso-opcion.dto';
import { UpdateRolPermisoOpcionDto } from './dto/update-rol-permiso-opcion.dto';

@Injectable()
export class RolPermisoOpcionService {
  create(createRolPermisoOpcionDto: CreateRolPermisoOpcionDto) {
    return 'This action adds a new rolPermisoOpcion';
  }

  findAll() {
    return `This action returns all rolPermisoOpcion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolPermisoOpcion`;
  }

  update(id: number, updateRolPermisoOpcionDto: UpdateRolPermisoOpcionDto) {
    return `This action updates a #${id} rolPermisoOpcion`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolPermisoOpcion`;
  }
}
