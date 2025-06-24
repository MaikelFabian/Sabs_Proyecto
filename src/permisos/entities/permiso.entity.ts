import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rolpermiso } from "src/rolpermiso/entities/rolpermiso.entity";

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

  @OneToMany(() => Rolpermiso, (rolpermiso) => rolpermiso.permiso)
  rolpermisos: Rolpermiso[];
}
