// src/titulado/entities/titulado.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Area } from 'src/areas/entities/area.entity';
import { Ficha } from 'src/fichas/entities/ficha.entity';

@Entity()
export class Titulado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  areaId?: number;

  @Column({ nullable: true })
  fichaId?: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => Area, (area) => area.titulados, { nullable: true })
  @JoinColumn({ name: 'areaId' })
  area?: Area;

  @ManyToOne(() => Ficha, (ficha) => ficha.titulados, { nullable: true })
  @JoinColumn({ name: 'fichaId' })
  ficha?: Ficha;
}
