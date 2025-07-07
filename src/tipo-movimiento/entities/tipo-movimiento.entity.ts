// src/tipo-movimiento/entities/tipo-movimiento.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';

@Entity()
export class TipoMovimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: true })
  activo: boolean;

  @Column()
  fechaCreacion: string;

  @Column({ nullable: true })
  fechaActualizacion?: string;

  @OneToMany(() => Movimiento, (movimiento) => movimiento.tipoMovimiento)
  movimientos?: Movimiento[];
}
