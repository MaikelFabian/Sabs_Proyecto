import { PartialType } from '@nestjs/mapped-types';
import { CreateOpcioneDto } from './create-opcione.dto';

export class UpdateOpcioneDto extends PartialType(CreateOpcioneDto) {}
