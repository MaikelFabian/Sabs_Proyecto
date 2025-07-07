import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';
import { Persona } from 'src/personas/entities/persona.entity';

@Entity()
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  tipoMovimientoId?: number;

  @Column({ nullable: true })
  personaId?: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => TipoMovimiento, (tipo) => tipo.movimientos, { nullable: true })
  @JoinColumn({ name: 'tipoMovimientoId' })
  tipoMovimiento?: TipoMovimiento;

  @ManyToOne(() => Persona, (persona) => persona.movimientos, { nullable: true })
  @JoinColumn({ name: 'personaId' })
  persona?: Persona;
}
