import { Column, Entity, Index, OneToMany } from "typeorm";
import { Material } from "src/materiales/entities/materiale.entity";


@Entity("unidadmedida", { schema: "public" })
export class Unidadmedida {
  @Column("uuid", {
    primary: true,
    name: "idunidadmedida",
    default: () => "gen_random_uuid()",
  })
  idunidadmedida: number;

  @Column("text", { name: "unidadmedida" })
  unidadmedida: string;

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

  @OneToMany(() => Material, (material) => material.unidadmedida)
  materials: Material[];
}
