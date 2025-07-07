// src/movimiento/entities/movimiento.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';

@Entity()
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TipoMovimiento, (tipo) => tipo.movimientos, { nullable: true })
  @JoinColumn({ name: 'tipoMovimientoId' })
  tipoMovimiento?: TipoMovimiento;

  @Column({ nullable: true })
  tipoMovimientoId?: number;

  @ManyToOne(() => Persona, (persona) => persona.movimientos, { nullable: true })
  @JoinColumn({ name: 'personaId' })
  persona?: Persona;

  @Column({ nullable: true })
  personaId?: number;

  @Column({ default: true })
  activo: boolean;

  @Column()
  fechaCreacion: string;

  @Column({ nullable: true })
  fechaActualizacion?: string;
}
