import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Solicitud } from 'src/solicitudes/entities/solicitud.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity';

@Entity()
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  tipoMovimientoId?: number;

  @Column({ nullable: true })
  personaId?: number;

  @Column()
  cantidad: number;

  // ✅ NUEVO CAMPO: Descripción
  @Column({ nullable: true })
  descripcion?: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => Material, (material) => material.movimientos, {
    eager: true,
  })
  @JoinColumn({ name: 'materialId' })
  material: Material;

  @Column()
  materialId: number;

  @ManyToOne(() => TipoMovimiento, (tipo) => tipo.movimientos, {
    nullable: true,
  })
  @JoinColumn({ name: 'tipoMovimientoId' })
  tipoMovimiento?: TipoMovimiento;

  @ManyToOne(() => Persona, (persona) => persona.movimientos, {
    nullable: true,
  })
  @JoinColumn({ name: 'personaId' })
  persona?: Persona;

  @ManyToOne(() => Solicitud, (solicitud) => solicitud.movimientos, {
    nullable: true,
  })
  @JoinColumn({ name: 'solicitudId' })
  solicitud: Solicitud;

  @Column({ nullable: true })
  solicitudId?: number;

  // ✅ NUEVO CAMPO: Relación con Sitio
  @ManyToOne(() => Sitio, { nullable: true })
  @JoinColumn({ name: 'sitioId' })
  sitio?: Sitio;

  @Column({ nullable: true })
  sitioId?: number;

  // Relación uno a uno con detalle
  @OneToOne(() => Detalles, (detalle) => detalle.movimiento, {
    nullable: true,
  })
  @JoinColumn({ name: 'detalleId' })
  detalle?: Detalles;

  @Column({ nullable: true })
  detalleId?: number;
}
