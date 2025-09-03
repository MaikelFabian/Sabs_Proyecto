import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Persona } from './persona.entity';
import { Sitio } from '../../sitios/entities/sitio.entity';

@Entity()
export class PersonaSitio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Persona)
  @JoinColumn({ name: 'personaId' })
  persona: Persona;

  @ManyToOne(() => Sitio)
  @JoinColumn({ name: 'sitioId' })
  sitio: Sitio;
}