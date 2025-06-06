import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Persona } from "src/personas/entities/persona.entity";
import { Tipomovimiento } from "src/tipo-movimiento/entities/tipo-movimiento.entity";


@Entity("movimiento", { schema: "public" })
export class Movimiento {
  @Column("uuid", {
    primary: true,
    name: "idmovimiento",
    default: () => "gen_random_uuid()",
  })
  idmovimiento: number;

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

  @ManyToOne(() => Persona, (persona) => persona.movimientos)
  @JoinColumn([
    { name: "movimientopersona", referencedColumnName: "idpersona" },
  ])
  movimientopersona: Persona;

  @ManyToOne(
    () => Tipomovimiento,
    (tipomovimiento) => tipomovimiento.movimientos
  )
  @JoinColumn([
    { name: "tipomovimiento", referencedColumnName: "idtipomovimiento" },
  ])
  tipomovimiento: Tipomovimiento;
}
