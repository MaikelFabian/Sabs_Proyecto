import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Tipositio } from "src/tipo-sitio/entities/tipo-sitio.entity";


@Entity("sitio", { schema: "public" })
export class Sitio {
  @Column("uuid", {
    primary: true,
    name: "idsitio",
    default: () => "gen_random_uuid()",
  })
  idsitio: number;

  @Column("text", { name: "sitio" })
  sitio: string;

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

  @ManyToOne(() => Tipositio, (tipositio) => tipositio.sitios)
  @JoinColumn([{ name: "tipositio", referencedColumnName: "idtipositio" }])
  tipositio: Tipositio;
}
