// src/sitio/entities/sitio.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TipoSitio } from 'src/tipo-sitio/entities/tipo-sitio.entity';

@Entity()
export class Sitio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  tipoSitioId?: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => TipoSitio, (tipoSitio) => tipoSitio.sitios, { nullable: true })
  @JoinColumn({ name: 'tipoSitioId' })
  tipoSitio?: TipoSitio;
}
