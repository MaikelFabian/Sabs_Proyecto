import { IsNumber, IsOptional } from "class-validator";

export class CreateDetallesDto {
  @IsNumber()
  @IsOptional()
  cantidad: number;

  @IsNumber()
  @IsOptional()
  materialId: number;

  @IsNumber()
  @IsOptional()
  solicitudId: number;
}
