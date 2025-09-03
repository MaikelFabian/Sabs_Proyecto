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
import { Persona } from 'src/personas/entities/persona.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';
import { Detalle } from 'src/detalles/entities/detalle.entity';

@Entity()
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number;

  // Persona que solicita
  @Column({ nullable: true })
  personaSolicitaId: number | null;

  @ManyToOne(() => Persona, (p) => p.movimientosSolicitados, { nullable: true })
  @JoinColumn({ name: 'personaSolicitaId' })
  personaSolicita?: Persona;

  // Persona que aprueba
  @Column({ nullable: true })
  personaApruebaId: number | null;

  @ManyToOne(() => Persona, (p) => p.movimientosAprobados, { nullable: true })
  @JoinColumn({ name: 'personaApruebaId' })
  personaAprueba?: Persona;

  // Sitio origen
  @Column({ nullable: true })
  sitioOrigenId: number | null;

  @ManyToOne(() => Sitio, (s) => s.movimientosOrigen, { nullable: true })
  @JoinColumn({ name: 'sitioOrigenId' })
  sitioOrigen?: Sitio;

  // Sitio destino
  @Column({ nullable: true })
  sitioDestinoId: number | null;

  @ManyToOne(() => Sitio, (s) => s.movimientosDestino, { nullable: true })
  @JoinColumn({ name: 'sitioDestinoId' })
  sitioDestino?: Sitio;

  // Tipo de movimiento (Entrada, Salida, Devolución…)
  @Column({ nullable: true })
  tipoMovimientoId: number | null;

  @ManyToOne(() => TipoMovimiento, (t) => t.movimientos, { nullable: true })
  @JoinColumn({ name: 'tipoMovimientoId' })
  tipoMovimiento?: TipoMovimiento;

  // Estado del movimiento
  @Column({ default: 'pendiente' })
  estado: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  // Relación con detalles
  @OneToMany(() => Detalle, (d) => d.movimiento)
  detalles?: Detalle[];

  // 🔄 NUEVO: Relación con movimiento original (para devoluciones)
  @Column({ nullable: true })
  movimientoOrigenId?: number | null;

  @ManyToOne(() => Movimiento, (m) => m.devoluciones, { nullable: true })
  @JoinColumn({ name: 'movimientoOrigenId' })
  movimientoOrigen?: Movimiento;

  @OneToMany(() => Movimiento, (m) => m.movimientoOrigen)
  devoluciones?: Movimiento[];
}
