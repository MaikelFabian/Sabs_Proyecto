import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { Titulado } from 'src/titulados/entities/titulado.entity';

@Entity('ficha', { schema: 'public' })
export class Ficha {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column('integer', { name: 'numero' })
  numero: number;

  @Column('integer', { name: 'cantidadaprendices', nullable: true })
  cantidadaprendices: number | null;

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

  @OneToMany(() => Persona, (persona) => persona.ficha)
  personas: Persona[];

  @OneToMany(() => Titulado, (titulado) => titulado.ficha)
  titulados: Titulado[];
}
