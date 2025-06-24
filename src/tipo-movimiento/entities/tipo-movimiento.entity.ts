import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movimiento } from "src/movimientos/entities/movimiento.entity";

@Entity("tipomovimiento", { schema: "public" })
export class Tipomovimiento {
  @PrimaryGeneratedColumn({ name: "idtipomovimiento", type: "integer" })
  idtipomovimiento: number;

  @Column("text", { name: "tipomovimiento" })
  tipomovimiento: string;

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

  @OneToMany(() => Movimiento, (movimiento) => movimiento.tipomovimiento)
  movimientos: Movimiento[];
}
