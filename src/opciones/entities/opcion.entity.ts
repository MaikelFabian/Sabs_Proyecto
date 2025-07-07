import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Modulo } from 'src/modulos/entities/modulo.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity'; // 👈 Importa esto

@Entity()
export class Opcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column()
  rutaFrontend: string;

  @ManyToOne(() => Modulo, (modulo) => modulo.opciones)
  @JoinColumn({ name: 'moduloId' })
  modulo: Modulo;

  @Column()
  moduloId: number;

  @OneToMany(() => Permiso, (permiso) => permiso.opcion)
  permisos?: Permiso[];

  @OneToMany(() => RolPermisoOpcion, (rpo) => rpo.opcion) // 👈 añade esta línea
  rolesPermisosOpciones?: RolPermisoOpcion[];
}
