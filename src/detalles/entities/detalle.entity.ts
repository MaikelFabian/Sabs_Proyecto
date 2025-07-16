// src/detalles/entities/detalles.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Solicitud } from 'src/solicitudes/entities/solicitud.entity';

@Entity()
export class Detalles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidadSolicitada: number;

  @Column({ nullable: true })
  descripcion?: string;

  @Column()
  cantidad: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => Material, (material) => material.detalles, {
    nullable: true,
  })
  @JoinColumn({ name: 'materialId' })
  material?: Material;

  @Column({ nullable: true })
  materialId?: number;

  @ManyToOne(() => Persona, (persona) => persona.encargos, { nullable: true })
  @JoinColumn({ name: 'personaEncargadaId' })
  personaEncargada?: Persona;

  @Column({ nullable: true })
  personaEncargadaId?: number;

  @ManyToOne(() => Persona, (persona) => persona.solicitudes, {
    nullable: true,
  })
  @JoinColumn({ name: 'personaSolicitaId' })
  personaSolicita?: Persona;

  @Column({ nullable: true })
  personaSolicitaId?: number;

  @ManyToOne(() => Persona, (persona) => persona.aprobaciones, {
    nullable: true,
  })
  @JoinColumn({ name: 'personaApruebaId' })
  personaAprueba?: Persona;

  @Column({ nullable: true })
  personaApruebaId?: number;

  @ManyToOne(() => Solicitud, (solicitud) => solicitud.detalles)
  solicitud: Solicitud;

  @Column({ nullable: true })
  solicitudId?: number;
}
