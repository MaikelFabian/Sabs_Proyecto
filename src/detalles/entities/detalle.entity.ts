import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Persona } from 'src/personas/entities/persona.entity';

@Entity('detalles', { schema: 'public' })
export class Detalles {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column('integer', { name: 'cantidaSolicitada' })
  cantidaSolicitada: number;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

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

  @ManyToOne(() => Material, (material) => material.detalles)
  @JoinColumn([{ name: 'material', referencedColumnName: 'id' }])
  material: Material;

  @ManyToOne(() => Persona, (persona) => persona.detalles)
  @JoinColumn([{ name: 'personaAprueba', referencedColumnName: 'id' }])
  personaAprueba: Persona;

  @ManyToOne(() => Persona, (persona) => persona.detalles2)
  @JoinColumn([{ name: 'personaEncargada', referencedColumnName: 'id' }])
  personaEncargada: Persona;

  @ManyToOne(() => Persona, (persona) => persona.detalles3)
  @JoinColumn([{ name: 'personaSolicita', referencedColumnName: 'id' }])
  personaSolicita: Persona;
}
