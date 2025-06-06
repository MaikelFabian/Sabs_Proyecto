import { PartialType } from '@nestjs/mapped-types';
import { CreateAreaCentroDto } from './create-area-centro.dto';

export class UpdateAreaCentroDto extends PartialType(CreateAreaCentroDto) {}
