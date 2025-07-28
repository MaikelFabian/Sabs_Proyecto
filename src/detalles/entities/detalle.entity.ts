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
import { Solicitud } from 'src/solicitudes/entities/solicitud.entity';
import { Persona } from 'src/personas/entities/persona.entity';

@Entity()
export class Detalles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidad: number;

  @ManyToOne(() => Material, (material) => material.detalles, { eager: true })
  @JoinColumn({ name: 'materialId' })
  material: Material;

  @Column()
  materialId: number;

  @ManyToOne(() => Solicitud, (solicitud) => solicitud.detalles, {
    nullable: true, //
  })
  @JoinColumn({ name: 'solicitudId' })
  solicitud?: Solicitud;

  @Column({ nullable: true })
  solicitudId?: number;

  // Persona que solicitó este detalle
  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'personaSolicitaId' })
  personaSolicita?: Persona;

  @Column({ nullable: true })
  personaSolicitaId?: number;

  // Persona que aprobó este detalle
  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'personaApruebaId' })
  personaAprueba?: Persona;

  @Column({ nullable: true })
  personaApruebaId?: number;

  // Persona que entrega este detalle
  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'personaEncargadaId' })
  personaEncargada?: Persona;

  @Column({ nullable: true })
  personaEncargadaId?: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
