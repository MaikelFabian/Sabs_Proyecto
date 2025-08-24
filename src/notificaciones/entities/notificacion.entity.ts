import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Persona } from '../../personas/entities/persona.entity'; // Ajusta según tu estructura

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @Column()
  mensaje: string;

  @Column({ default: false })
  leida: boolean;

  @ManyToOne(() => Persona, (persona) => persona.notificaciones, {
    onDelete: 'CASCADE',
  })
  persona: Persona;

 
}