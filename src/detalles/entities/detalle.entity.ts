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

  @ManyToOne(() => Material, (material) => material.detalles, { eager: true })
  @JoinColumn({ name: 'materialId' })
  material: Material;

  @Column()
  materialId: number;

  @Column({ default: 'PENDIENTE' })
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ENTREGADO' | 'DEVUELTO';

  @ManyToOne(() => Solicitud, (solicitud) => solicitud.detalles, {
    nullable: true,  // Cambiado a true para permitir detalles sin solicitud
  })
  @JoinColumn({ name: 'solicitudId' })
  solicitud?: Solicitud;  // Cambiado a opcional
  
  @Column({ nullable: true })  // Añadido nullable: true
  solicitudId?: number;

  @OneToOne(() => Movimiento, (movimiento) => movimiento.detalle, {
    nullable: true,
  })
  movimiento?: Movimiento;

  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'personaApruebaId' })
  personaAprueba?: Persona;

  @Column({ nullable: true })
  personaApruebaId?: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
