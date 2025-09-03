import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Persona } from '../../personas/entities/persona.entity';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @Column({ nullable: true })
  titulo: string;

  @Column()
  mensaje: string;

  @Column({ default: false })
  leida: boolean;

  @Column({ nullable: true })
  relacionadoId: number; // ID del movimiento, material, etc.

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Persona, (persona) => persona.notificaciones, {
    onDelete: 'CASCADE',
  })
  persona: Persona;
}