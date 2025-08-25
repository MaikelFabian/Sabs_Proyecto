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
import { Material } from 'src/materiales/entities/materiale.entity';
import { Solicitud } from 'src/solicitudes/entities/solicitud.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';

@Entity()
export class Detalles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidad: number;

  // ✅ NUEVO: Campo para número de factura
  @Column({ nullable: true })
  numeroFactura?: string;

  // ✅ NUEVO: Campo para descripción de la acción
  @Column({ nullable: true })
  accion?: string;

  @ManyToOne(() => Material, (material) => material.detalles, { eager: true })
  @JoinColumn({ name: 'materialId' })
  material: Material;

  @Column()
  materialId: number;

  @Column({ default: 'PENDIENTE' })
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'PRESTADO' | 'DEVUELTO' | 'CONSUMIDO';

  @ManyToOne(() => Solicitud, (solicitud) => solicitud.detalles, {
    nullable: true,
  })
  @JoinColumn({ name: 'solicitudId' })
  solicitud?: Solicitud;
  
  @Column({ nullable: true })
  solicitudId?: number;

  // ✅ MEJORADO: Relación con solicitante directo
  @ManyToOne(() => Persona, { nullable: true, eager: true })
  @JoinColumn({ name: 'solicitanteId' })
  solicitante?: Persona;

  @Column({ nullable: true })
  solicitanteId?: number;

  @OneToOne(() => Movimiento, (movimiento) => movimiento.detalle, {
    nullable: true,
  })
  movimiento?: Movimiento;

  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'personaApruebaId' })
  personaAprueba?: Persona;

  @Column({ nullable: true })
  personaApruebaId?: number;

  // ✅ NUEVO: Persona que entrega
  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'personaEntregaId' })
  personaEntrega?: Persona;

  @Column({ nullable: true })
  personaEntregaId?: number;

  // ✅ NUEVO: Persona que devuelve
  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'personaDevuelveId' })
  personaDevuelve?: Persona;

  @Column({ nullable: true })
  personaDevuelveId?: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
