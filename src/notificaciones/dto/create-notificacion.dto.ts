import { IsEnum, IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificacionDto {
  @IsEnum([
    'solicitud_material', 
    'solicitud_aprobada', 
    'solicitud_rechazada',
    'material_caducidad', 
    'stock_bajo', 
    'nuevo_material',
    'solicitud_pendiente'
  ])
  tipo: 'solicitud_material' | 'solicitud_aprobada' | 'solicitud_rechazada' | 
        'material_caducidad' | 'stock_bajo' | 'nuevo_material' | 'solicitud_pendiente';

  @IsString()
  mensaje: string;

  @IsInt()
  personaId: number;

  @IsOptional()
  @IsBoolean()
  leida?: boolean;

  @IsOptional()
  @IsInt()
  relacionadoId?: number; // ID del movimiento, material, etc.

  @IsOptional()
  @IsString()
  titulo?: string;
}