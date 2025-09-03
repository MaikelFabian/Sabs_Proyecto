// src/modulo/entities/modulo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Opcion } from 'src/opciones/entities/opcion.entity';

@Entity()
export class Modulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Opcion, (opcion) => opcion.modulo)
  opciones?: Opcion[];
}
