// src/ficha/entities/ficha.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { Titulado } from 'src/titulados/entities/titulado.entity';

@Entity()
export class Ficha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero: number;

  @Column({ nullable: true })
  cantidadAprendices?: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @OneToMany(() => Persona, (persona) => persona.ficha)
  personas?: Persona[];

  @OneToMany(() => Titulado, (titulado) => titulado.ficha)
  titulados?: Titulado[];
}
