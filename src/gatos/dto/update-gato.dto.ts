import { PartialType } from '@nestjs/mapped-types';
import { CreateGatoDto } from './create-gato.dto';

export class UpdateGatoDto extends PartialType(CreateGatoDto) {}
