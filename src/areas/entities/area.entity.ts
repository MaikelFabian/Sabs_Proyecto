import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Areacentro } from 'src/area-centro/entities/area-centro.entity';
import { Titulado } from 'src/titulados/entities/titulado.entity';

@Entity('area', { schema: 'public' })
export class Area {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column('text', { name: 'area' })
  area: string;

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

  @OneToMany(() => Areacentro, (areacentro) => areacentro.area)
  areacentros: Areacentro[];

  @OneToMany(() => Titulado, (titulado) => titulado.area)
  titulados: Titulado[];
}
