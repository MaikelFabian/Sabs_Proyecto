import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "src/materiales/entities/materiale.entity";

@Entity("categoriamaterial", { schema: "public" })
export class Categoriamaterial {
  @PrimaryGeneratedColumn({ name: "idcategoriamaterial", type: "integer" })
  idcategoriamaterial: number;

  @Column("text", { name: "códigomaterial" })
  cDigomaterial: string;

  @Column("text", { name: "categoria" })
  categoria: string;

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

  @OneToMany(() => Material, (material) => material.categoriamaterial)
  materials: Material[];
}
