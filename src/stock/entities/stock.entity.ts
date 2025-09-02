import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Material } from 'src/materiales/entities/materiale.entity';
import { StockMovimiento } from './stock-movimiento.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  codigo?: string; 

  @Column({ default: 1 })
  cantidad: number; 

  @Column({ default: false })
  activo: boolean; 

  @Column({ default: false })
  requiereCodigo: boolean; 

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  // Relación con Material
  @ManyToOne(() => Material, (material) => material.stocks)
  @JoinColumn({ name: 'materialId' })
  material: Material;

  @Column()
  materialId: number;

  // Relación con Sitio
  @ManyToOne(() => Sitio, { nullable: true })
  @JoinColumn({ name: 'sitioId' })
  sitio?: Sitio;

  @Column({ nullable: true })
  sitioId?: number ;

  // Historial de movimientos donde participa este stock
  @OneToMany(() => StockMovimiento, (stockMovimiento) => stockMovimiento.stock)
  movimientos?: StockMovimiento[];

  @OneToMany(() => StockMovimiento, (stockMovimiento) => stockMovimiento.stockDestino)
  movimientosDestino?: StockMovimiento[];

  // Trazabilidad
  @Column({ nullable: true })
  stockOrigenId?: number;

  @ManyToOne(() => Stock, { nullable: true })
  @JoinColumn({ name: 'stockOrigenId' })
  stockOrigen?: Stock;

  @Column({ default: false })
  esTransferido: boolean;
}
