import { Column, Entity, Index, OneToMany } from "typeorm";
import { Persona } from "src/personas/entities/persona.entity";
import { Titulado } from "src/titulados/entities/titulado.entity";

@Entity("ficha", { schema: "public" })
export class Ficha {
  @Column("uuid", {
    primary: true,
    name: "idficha",
    default: () => "gen_random_uuid()",
  })
  idficha: number;

  @Column("integer", { name: "numficha" })
  numficha: number;

  @Column("integer", { name: "cantidadaprendices", nullable: true })
  cantidadaprendices: number | null;

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

  @OneToMany(() => Persona, (persona) => persona.ficha)
  personas: Persona[];

  @OneToMany(() => Titulado, (titulado) => titulado.ficha)
  titulados: Titulado[];
}
