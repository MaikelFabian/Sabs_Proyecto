import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Centro } from 'src/centros/entities/centro.entity';

@Entity('sede', { schema: 'public' })
export class Sede {
  @PrimaryGeneratedColumn({ name: 'idsede', type: 'integer' })
  idsede: number;

  @Column('text', { name: 'sede' })
  sede: string;

  @Column('text', { name: 'direccion' })
  direccion: string;

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

  @ManyToOne(() => Centro, (centro) => centro.sedes)
  @JoinColumn([{ name: 'centro', referencedColumnName: 'id' }])
  centro: Centro;
}
