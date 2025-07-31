import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDetallesDto {
  @IsNumber()
  cantidad: number;

  @IsNumber()
  materialId: number;

  @IsNumber()
  solicitudId: number;

  @IsOptional()
  @IsString()
  estado?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ENTREGADO' | 'DEVUELTO';

  @IsOptional()
  @IsNumber()
  personaApruebaId?: number;
}
