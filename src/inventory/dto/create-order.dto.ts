import { IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  itemId: number;

  @IsNumber()
  quantity: number;

  @IsEnum(['entrada', 'salida'])
  type: 'entrada' | 'salida';
}