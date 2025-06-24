import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Permiso } from "src/permisos/entities/permiso.entity";
import { Rol } from "src/roles/entities/role.entity";

@Entity("rolpermiso", { schema: "public" })
export class Rolpermiso {
  @PrimaryGeneratedColumn({ name: "idrolpermiso", type: "integer" })
  idrolpermiso: number;

  @Column("integer", { name: "rolid" })
  rolid: number;

  @Column("integer", { name: "permisoid" })
  permisoid: number;

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
