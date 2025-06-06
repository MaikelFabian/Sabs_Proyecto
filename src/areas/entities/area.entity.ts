import { Column, Entity, Index, OneToMany } from "typeorm";
import { Areacentro } from "src/area-centro/entities/area-centro.entity";
import { Titulado } from "src/titulados/entities/titulado.entity";

@Entity("area", { schema: "public" })
export class Area {
  @Column("uuid", {
    primary: true,
    name: "idarea",
    default: () => "gen_random_uuid()",
  })
  idarea: number;

  @Column("text", { name: "area" })
  area: string;

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

  @OneToMany(() => Areacentro, (areacentro) => areacentro.area)
  areacentros: Areacentro[];

  @OneToMany(() => Titulado, (titulado) => titulado.area)
  titulados: Titulado[];
}
