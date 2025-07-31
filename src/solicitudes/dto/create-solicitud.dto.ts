import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSolicitudDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsInt()
  personaId: number;

  @IsOptional()
  @IsString()
  estado?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'ENTREGADA' | 'DEVUELTA';
}
