import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Area } from 'src/areas/entities/area.entity';
import { Ficha } from 'src/fichas/entities/ficha.entity';

@Entity('titulado', { schema: 'public' })
export class Titulado {
  @PrimaryGeneratedColumn({ name: 'idtitulado', type: 'integer' })
  idtitulado: number;

  @Column('text', { name: 'titulado' })
  titulado: string;

  @Column('boolean', { name: 'activo', nullable: true, default: () => 'true' })
  activo: boolean | null;

  @Column('timestamp without time zone', {
    name: 'fechaCreacion',
    nullable: true,
    default: () => 'now()',
  })
  fechaCreacion: Date | null;

  @Column('timestamp without time zone', {
    name: 'fechaActualizacion',
    nullable: true,
  })
  fechaActualizacion: Date | null;

  @ManyToOne(() => Area, (area) => area.titulados)
  @JoinColumn([{ name: 'area', referencedColumnName: 'id' }])
  area: Area;

  @ManyToOne(() => Ficha, (ficha) => ficha.titulados)
  @JoinColumn([{ name: 'ficha', referencedColumnName: 'id' }])
  ficha: Ficha;
}
