import { PartialType } from '@nestjs/mapped-types';
import { CreateTituladoDto } from './create-titulado.dto';

export class UpdateTituladoDto extends PartialType(CreateTituladoDto) {}
