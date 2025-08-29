import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}