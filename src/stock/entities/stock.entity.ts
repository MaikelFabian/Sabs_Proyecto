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

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  codigo?: string; // Código individual opcional por unidad

  @Column()
  cantidad: number;

  @Column({ default: false })
  activo: boolean; // Inicia inactivo hasta ser activado

  @Column({ default: false })
  requiereCodigo: boolean; // Indica si este stock requiere código individual

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

  // ✅ NUEVA RELACIÓN: Movimientos de este stock
  @OneToMany(() => StockMovimiento, (stockMovimiento) => stockMovimiento.stock)
  movimientos?: StockMovimiento[];

  // ✅ NUEVA RELACIÓN: Movimientos donde este stock es el destino
  @OneToMany(() => StockMovimiento, (stockMovimiento) => stockMovimiento.stockDestino)
  movimientosDestino?: StockMovimiento[];

  // ✅ NUEVO CAMPO: Para rastrear el stock original (en caso de transferencias)
  @Column({ nullable: true })
  stockOrigenId?: number;

  @ManyToOne(() => Stock, { nullable: true })
  @JoinColumn({ name: 'stockOrigenId' })
  stockOrigen?: Stock;

  // ✅ NUEVO CAMPO: Indica si este stock fue transferido desde otro sitio
  @Column({ default: false })
  esTransferido: boolean;
}