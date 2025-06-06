import { Column, Entity, Index, OneToMany } from "typeorm";
import { Material } from "src/materiales/entities/materiale.entity";

@Entity("tipomaterial", { schema: "public" })
export class Tipomaterial {
  @Column("uuid", {
    primary: true,
    name: "idtipomaterial",
    default: () => "gen_random_uuid()",
  })
  idtipomaterial: number;

  @Column("text", { name: "tipo" })
  tipo: string;

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

  @OneToMany(() => Material, (material) => material.tipomaterial)
  materials: Material[];
}
