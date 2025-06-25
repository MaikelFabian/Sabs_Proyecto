import { IsIn,  IsInt, IsNotEmpty } from 'class-validator';

export class UpdateStockDto {
    @IsInt()
    @IsNotEmpty()
    stock: number;

    @IsNotEmpty()
    tipo: 'ENTRADA' | 'SALIDA'; 
}