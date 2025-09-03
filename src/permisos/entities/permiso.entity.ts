import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Opcion } from 'src/opciones/entities/opcion.entity';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';

@Entity()
export class Permiso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column()
  codigo: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => Opcion, (opcion) => opcion.permisos, { nullable: true })
  @JoinColumn({ name: 'opcionId' })
  opcion?: Opcion;

  @Column({ nullable: true })
  opcionId?: number;

  @OneToMany(() => RolPermisoOpcion, (rpo) => rpo.permiso)
  rolesPermisosOpciones?: RolPermisoOpcion[];
}
