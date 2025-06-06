import { PartialType } from '@nestjs/mapped-types';
import { CreateSitioDto } from './create-sitio.dto';

export class UpdateSitioDto extends PartialType(CreateSitioDto) {}
