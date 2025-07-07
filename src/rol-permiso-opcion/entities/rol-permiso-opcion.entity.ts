// src/rol-permiso-opcion/entities/rol-permiso-opcion.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from 'src/roles/entities/role.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { Opcion } from 'src/opciones/entities/opcion.entity';

@Entity()
export class RolPermisoOpcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Rol, (rol) => rol.id, { nullable: true })
  @JoinColumn({ name: 'rolId' })
  rol?: Rol;

  @ManyToOne(() => Permiso, (permiso) => permiso.id, { nullable: true })
  @JoinColumn({ name: 'permisoId' })
  permiso?: Permiso;

  @ManyToOne(() => Opcion, (opcion) => opcion.id, { nullable: true })
  @JoinColumn({ name: 'opcionId' })
  opcion?: Opcion;
}
