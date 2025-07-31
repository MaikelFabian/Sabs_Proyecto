import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/role.entity';
import { CreateRolDto } from './dto/create-role.dto';
import { UpdateRolDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(data: CreateRolDto) {
    if (data.permisosId) {
      data.permisosId = { id: data.permisosId } as any;
    }

    const nuevo = await this.rolRepository.save(data);
    return {
      message: 'Rol creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const lista = await this.rolRepository.find({ relations: ['personas'] });
    return {
      message: 'Listado de roles',
      data: lista,
    };
  }

  async findOne(id: number) {
    const rol = await this.rolRepository.findOne({
      where: { id },
      relations: ['personas', 'permisos'],
    });
    if (!rol) throw new NotFoundException(`Rol con id ${id} no encontrado`);
    return {
      message: 'Rol encontrado',
      data: rol,
    };
  }

  async update(id: number, updateRolDto: UpdateRolDto) {

    const camposActualizables = ['nombre', 'activo', 'permisosId'];
    const updateData = {};
    

    camposActualizables.forEach(campo => {
      if (updateRolDto[campo] !== undefined) {
        updateData[campo] = updateRolDto[campo];
      }
    });
    

    const rolExistente = await this.rolRepository.findOne({ where: { id } });
    if (!rolExistente) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    if (Object.keys(updateData).length > 0) {
      await this.rolRepository.update(id, updateData);
    }
    
 
    const actualizado = await this.rolRepository.findOne({
      where: { id },
      relations: ['personas']
    });
    
    return {
      message: 'Rol actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.rolRepository.delete(id);
    return {
      message: 'Rol eliminado exitosamente',
    };
  }

  async getAllWithPermisosYOpciones() {
    const data = await this.rolRepository.find({
      relations: [
        'rolesPermisosOpciones',
        'rolesPermisosOpciones.permiso',
        'rolesPermisosOpciones.opcion',
        'rolesPermisosOpciones.opcion.modulo',
      ],
    });
    return {
      message: 'Roles con permisos y opciones',
      data,
    };
  }
}
