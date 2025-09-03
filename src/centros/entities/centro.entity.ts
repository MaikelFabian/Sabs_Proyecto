import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Municipio } from 'src/municipios/entities/municipio.entity';
import { AreaCentro } from 'src/area-centro/entities/area-centro.entity';
import { Sede } from 'src/sedes/entities/sede.entity';

@Entity()
export class Centro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  municipioId?: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => Municipio, (municipio) => municipio.centros, { nullable: true })
  @JoinColumn({ name: 'municipioId' })
  municipio?: Municipio;

  @OneToMany(() => AreaCentro, (areaCentro) => areaCentro.centro)
  areasCentro?: AreaCentro[];

  @OneToMany(() => Sede, (sede) => sede.centro)
  sedes?: Sede[];
}
