import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Area } from 'src/areas/entities/area.entity';
import { Centro } from 'src/centros/entities/centro.entity';

@Entity('areacentro', { schema: 'public' })
export class Areacentro {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

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

  @ManyToOne(() => Area, (area) => area.areacentros)
  @JoinColumn([{ name: 'area', referencedColumnName: 'id' }])
  area: Area;

  @ManyToOne(() => Centro, (centro) => centro.areacentros)
  @JoinColumn([{ name: 'centro', referencedColumnName: 'id' }])
  centro: Centro;
}
