import { Column, Entity, Index, OneToMany } from "typeorm";
import { Persona } from "src/personas/entities/persona.entity";
import { Rolpermiso } from "src/rolpermiso/entities/rolpermiso.entity";


@Entity("rol", { schema: "public" })
export class Rol {
  @Column("uuid", {
    primary: true,
    name: "idrol",
    default: () => "gen_random_uuid()",
  })
  idrol: number;

  @Column("text", { name: "nombrerol" })
  nombrerol: string;

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

  @OneToMany(() => Persona, (persona) => persona.rol)
  personas: Persona[];

  @OneToMany(() => Rolpermiso, (rolpermiso) => rolpermiso.rol)
  rolpermisos: Rolpermiso[];
}
