import { Column, Entity, Index, OneToMany } from "typeorm";
import { Sitio } from "src/sitios/entities/sitio.entity";


@Entity("tipositio", { schema: "public" })
export class Tipositio {
  @Column("uuid", {
    primary: true,
    name: "idtipositio",
    default: () => "gen_random_uuid()",
  })
  idtipositio: number;

  @Column("text", { name: "tipositio" })
  tipositio: string;

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

  @OneToMany(() => Sitio, (sitio) => sitio.tipositio)
  sitios: Sitio[];
}
