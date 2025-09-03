import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallesDto } from './create-detalle.dto';

export class UpdateDetallesDto extends PartialType(CreateDetallesDto) {}
