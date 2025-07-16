import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';

@Entity()
export class Solicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descripcion: string;

  @Column({ default: 'PENDIENTE' })
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'ENTREGADA';

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Quién hizo la solicitud
  @ManyToOne(() => Persona, (persona) => persona.solicitudes)
  persona: Persona;

  @Column()
  personaId: number;

  // Detalles de la solicitud (puede incluir varios materiales)
  @OneToMany(() => Detalles, (detalle) => detalle.solicitud)
  detalles: Detalles[];

  @Column({ nullable: true })
  personaApruebaId?: number;

  @Column({ nullable: true })
  personaEncargadaId?: number;

  @Column({ nullable: true })
  aprobada?: boolean;
}
