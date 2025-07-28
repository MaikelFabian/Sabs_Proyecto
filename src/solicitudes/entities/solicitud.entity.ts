import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';

@Entity()
export class Solicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descripcion: string;

  @Column({ default: 'PENDIENTE' })
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'ENTREGADA' | 'DEVUELTA';

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  @ManyToOne(() => Persona, (persona) => persona.solicitudes)
  solicitante: Persona;

  @ManyToOne(() => Persona, { nullable: true })
  aprobador?: Persona;

  @ManyToOne(() => Persona, { nullable: true })
  encargadoEntrega?: Persona;

  @OneToMany(() => Detalles, (detalle) => detalle.solicitud, { cascade: true })
  detalles: Detalles[];

  @OneToMany(() => Movimiento, (movimiento) => movimiento.solicitud)
movimientos: Movimiento[];

}
