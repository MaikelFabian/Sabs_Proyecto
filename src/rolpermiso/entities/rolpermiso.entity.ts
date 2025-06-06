import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Permiso } from "src/permisos/entities/permiso.entity";
import { Rol } from "src/roles/entities/role.entity";


@Entity("rolpermiso", { schema: "public" })
export class Rolpermiso {
  @Column("uuid", {
    primary: true,
    name: "idrolpermiso",
    default: () => "gen_random_uuid()",
  })
  idrolpermiso: number;

  @Column("uuid", { name: "rolid", unique: true })
  rolid: string;

  @Column("uuid", { name: "permisoid", unique: true })
  permisoid: string;

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

  @ManyToOne(() => Permiso, (permiso) => permiso.rolpermisos)
  @JoinColumn([{ name: "permisoid", referencedColumnName: "idpermiso" }])
  permiso: Permiso;

  @ManyToOne(() => Rol, (rol) => rol.rolpermisos)
  @JoinColumn([{ name: "rolid", referencedColumnName: "idrol" }])
  rol: Rol;
}
