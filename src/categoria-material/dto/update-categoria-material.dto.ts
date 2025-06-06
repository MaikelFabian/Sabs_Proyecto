import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaMaterialDto } from './create-categoria-material.dto';

export class UpdateCategoriaMaterialDto extends PartialType(CreateCategoriaMaterialDto) {}
