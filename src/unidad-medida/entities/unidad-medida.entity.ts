import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "src/materiales/entities/materiale.entity";

@Entity("unidadmedida", { schema: "public" })
export class Unidadmedida {
  @PrimaryGeneratedColumn({ name: "idunidadmedida", type: "integer" })
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
