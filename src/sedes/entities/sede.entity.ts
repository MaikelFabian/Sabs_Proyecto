import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Centro } from "src/centros/entities/centro.entity";

@Entity("sede", { schema: "public" })
export class Sede {
  @Column("uuid", {
    primary: true,
    name: "idsede",
    default: () => "gen_random_uuid()",
  })
  idsede: number;

  @Column("text", { name: "sede" })
  sede: string;

  @Column("text", { name: "direccion" })
  direccion: string;

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

  @ManyToOne(() => Centro, (centro) => centro.sedes)
  @JoinColumn([{ name: "centro", referencedColumnName: "idcentro" }])
  centro: Centro;
}
