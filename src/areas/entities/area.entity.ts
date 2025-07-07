import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AreaCentro } from 'src/area-centro/entities/area-centro.entity';
import { Titulado } from 'src/titulados/entities/titulado.entity';

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @OneToMany(() => AreaCentro, (areaCentro) => areaCentro.area)
  areasCentro?: AreaCentro[];

  @OneToMany(() => Titulado, (titulado) => titulado.area)
  titulados?: Titulado[];
}
