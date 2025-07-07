import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Centro } from 'src/centros/entities/centro.entity';

@Entity('municipio', { schema: 'public' })
export class Municipio {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column('text', { name: 'municipio' })
  municipio: string;

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

  @OneToMany(() => Centro, (centro) => centro.municipio)
  centros: Centro[];
}
