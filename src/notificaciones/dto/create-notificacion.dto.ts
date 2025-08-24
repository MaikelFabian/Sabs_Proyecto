import { IsEnum, IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificacionDto {
  @IsEnum(['movimiento', 'caducidad', 'stock_bajo', 'nuevo_material'])
  tipo: 'movimiento' | 'caducidad' | 'stock_bajo' | 'nuevo_material';

  @IsString()
  mensaje: string;

  @IsInt()
  personaId: number;

  @IsOptional()
  @IsBoolean()
  leida?: boolean;

  @IsOptional()
  @IsInt()
  relacionadoId?: number;
}