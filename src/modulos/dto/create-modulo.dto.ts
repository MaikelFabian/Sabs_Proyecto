import { IsString } from 'class-validator';

export class CreateModuloDto {
  @IsString()
  nombre: string;
}
