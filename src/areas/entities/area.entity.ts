import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Areacentro } from "src/area-centro/entities/area-centro.entity";
import { Titulado } from "src/titulados/entities/titulado.entity";

@Entity("area", { schema: "public" })
export class Area {
  @PrimaryGeneratedColumn({ name: "idarea", type: "integer" })
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
