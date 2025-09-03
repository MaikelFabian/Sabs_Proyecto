import { PartialType } from '@nestjs/mapped-types';
import { CreateOpcionDto } from './create-opcione.dto';

export class UpdateOpcionDto extends PartialType(CreateOpcionDto) {}
