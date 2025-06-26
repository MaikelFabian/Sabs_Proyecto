import { Column, Entity, OneToMany, PrimaryGeneratedColumn,JoinColumn, ManyToOne } from "typeorm";
import { Opcion } from "src/opciones/entities/opcion.entity";
import { Rol } from "src/roles/entities/role.entity";
import { RolPermisoOpcion } from "src/rol-permiso-opcion/entities/rol-permiso-opcion.entity";


@Entity("permiso", { schema: "public" })
export class Permiso {
  @PrimaryGeneratedColumn({ name: "idpermiso", type: "integer" })
  idpermiso: number;

  @Column("text", { name: "nombre" })
  nombre: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("text", { name: "codigo", unique: true })
  codigo: string;

  @Column("boolean", { name: "activo", nullable: true, default: () => "true" })
  activo: boolean | null;

  @Column("timestamp without time zone", {
    name: "fechacreacion",
    nullable: true,
    default: () => "now()",
  })
  fechacreacion: Date | null;

  @Column("timestamp without time zone", {
    name: "fechaactualización",
    nullable: true,
  })
  fechaactualizaciN: Date | null;
  @OneToMany(() => Rol, (rol) => rol.permisos)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Opcion, (opcion) => opcion.permisos)
  @JoinColumn({ name: 'id_opcion' })
  opcion: Opcion;
  @OneToMany(() => RolPermisoOpcion, (rpo) => rpo.permiso)
  rolPermisoOpciones: RolPermisoOpcion[];


}
