import { PartialType } from '@nestjs/mapped-types';
import { CreateRolPermisoOpcionDto } from './create-rol-permiso-opcion.dto';

export class UpdateRolPermisoOpcionDto extends PartialType(CreateRolPermisoOpcionDto) {}
