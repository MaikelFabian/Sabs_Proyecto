// src/rol/entities/rol.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @OneToMany(() => Persona, (persona) => persona.rol)
  personas?: Persona[];

  @ManyToOne(() => Permiso, (permiso) => permiso.rolesPermisosOpciones, { nullable: true })
  @JoinColumn({ name: 'permisosId' })
  permisos?: Permiso;

  @Column({ nullable: true })
  permisosId?: number;
}
