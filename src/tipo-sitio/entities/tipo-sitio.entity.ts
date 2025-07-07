import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Sitio } from 'src/sitios/entities/sitio.entity';

@Entity('tipositio', { schema: 'public' })
export class Tipositio {
  @PrimaryGeneratedColumn({ name: 'idtipositio', type: 'integer' })
  idtipositio: number;

  @Column('text', { name: 'tipositio' })
  tipositio: string;

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

  @OneToMany(() => Sitio, (sitio) => sitio.tipositio)
  sitios: Sitio[];
}
