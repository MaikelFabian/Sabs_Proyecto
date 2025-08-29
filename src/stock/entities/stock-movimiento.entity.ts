import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Stock } from './stock.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';

@Entity()
export class StockMovimiento {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación con el movimiento
  @ManyToOne(() => Movimiento, { eager: true })
  @JoinColumn({ name: 'movimientoId' })
  movimiento: Movimiento;

  @Column()
  movimientoId: number;

  // Stock específico que se mueve
  @ManyToOne(() => Stock, { eager: true })
  @JoinColumn({ name: 'stockId' })
  stock: Stock;

  @Column()
  stockId: number;

  // Cantidad de este stock específico que se mueve
  @Column()
  cantidad: number;

  // Tipo de operación: 'salida' (del origen) o 'entrada' (al destino)
  @Column({
    type: 'enum',
    enum: ['salida', 'entrada']
  })
  tipoOperacion: 'salida' | 'entrada';

  // Para rastrear el stock en el sitio destino (cuando se crea uno nuevo)
  @Column({ nullable: true })
  stockDestinoId?: number;

  @ManyToOne(() => Stock, { nullable: true })
  @JoinColumn({ name: 'stockDestinoId' })
  stockDestino?: Stock;

  @CreateDateColumn()
  fechaCreacion: Date;

  @Column({ default: true })
  activo: boolean;
}