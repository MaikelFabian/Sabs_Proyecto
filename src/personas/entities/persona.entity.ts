// src/persona/entities/persona.entity.ts
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
import { Exclude } from 'class-transformer';
import { Rol } from 'src/roles/entities/role.entity';
import { Ficha } from 'src/fichas/entities/ficha.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { Notificacion } from 'src/notificaciones/entities/notificacion.entity';

@Entity()
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identificacion: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ nullable: true })
  telefono: string;

  @Column()
  correo: string;

  @Column()
  @Exclude()
  contrasena: string;

  @Column()
  edad: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => Rol, (rol) => rol.personas, { nullable: true })
  @JoinColumn({ name: 'rolId' })
  rol?: Rol;

  @Column({ nullable: true })
  rolId?: number;

  @ManyToOne(() => Ficha, (ficha) => ficha.personas, { nullable: true })
  @JoinColumn({ name: 'fichaId' })
  ficha?: Ficha;

  @Column({ nullable: true })
  fichaId?: number;

  @OneToMany(() => Detalles, (detalle) => detalle.personaAprueba)
  aprobaciones?: Detalles[];

  @OneToMany(() => Movimiento, (movimiento) => movimiento.persona)
  movimientos?: Movimiento[];

  @OneToMany(() => Notificacion, (notificacion) => notificacion.persona)
  notificaciones?: Notificacion[];
}
