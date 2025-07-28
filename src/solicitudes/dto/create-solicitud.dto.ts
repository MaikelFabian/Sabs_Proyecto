import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class MaterialCantidadDto {
  @IsInt()
  materialId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreateSolicitudDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsInt()
  personaId: number;

  @IsNotEmpty()
  @IsString()
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'ENTREGADA' | 'DEVUELTA';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialCantidadDto)
  detalles: MaterialCantidadDto[];
}
