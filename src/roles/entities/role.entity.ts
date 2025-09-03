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
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';

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

  @OneToMany(() => RolPermisoOpcion, (rpo) => rpo.rol)
  rolesPermisosOpciones?: RolPermisoOpcion[];
}
