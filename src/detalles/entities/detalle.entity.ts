import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Persona } from 'src/personas/entities/persona.entity';

@Entity()
export class Detalle {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación con movimiento
  @Column()
  movimientoId: number;

  @ManyToOne(() => Movimiento, (mov) => mov.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movimientoId' })
  movimiento: Movimiento;

  // Relación con material
  @Column()
  materialId: number;

  @ManyToOne(() => Material, (mat) => mat.detalles)
  @JoinColumn({ name: 'materialId' })
  material: Material;

  // Cantidad solicitada o movida
  @Column()
  cantidad: number;

  // Estado del detalle (pendiente, completado, rechazado)
  @Column({ default: 'pendiente' })
  estado: string;

  // Persona que solicita este detalle (opcional si se requiere granularidad)
@Column({ nullable: true })
personaSolicitaId: number | null;


  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'personaSolicitaId' })
  personaSolicita?: Persona;

  // Persona que aprueba este detalle (puede diferir del movimiento global)
  @Column({ nullable: true })
  personaApruebaId?: number;

  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'personaApruebaId' })
  personaAprueba?: Persona;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;
}
