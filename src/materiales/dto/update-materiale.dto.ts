import { IsIn,  IsInt, IsNotEmpty } from 'class-validator';

export class UpdateMaterialDto {
    @IsInt()
    @IsNotEmpty()
    stock: number;

    @IsNotEmpty()
    tipo: 'ENTRADA' | 'SALIDA'; 
}