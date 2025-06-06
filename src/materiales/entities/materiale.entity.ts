import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Detalles } from "src/detalles/entities/detalle.entity";
import { Categoriamaterial } from "src/categoria-material/entities/categoria-material.entity";
import { Tipomaterial } from "src/tipo-material/entities/tipo-material.entity";
import { Unidadmedida } from "src/unidad-medida/entities/unidad-medida.entity";

@Entity("material", { schema: "public" })
export class Material {
  @Column("uuid", {
    primary: true,
    name: "idmaterial",
    default: () => "gen_random_uuid()",
  })
  idmaterial: number;

  @Column("text", { name: "nombrematerial" })
  nombrematerial: string;

  @Column("text", { name: "descripcion" })
  descripcion: string;

  @Column("integer", { name: "stock" })
  stock: number;

  @Column("boolean", { name: "caduca" })
  caduca: boolean;

  @Column("timestamp without time zone", {
    name: "fechavencimiento",
    nullable: true,
  })
  fechavencimiento: Date | null;

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

  @OneToMany(() => Detalles, (detalles) => detalles.material)
  detalles: Detalles[];

  @ManyToOne(
    () => Categoriamaterial,
    (categoriamaterial) => categoriamaterial.materials
  )
  @JoinColumn([
    { name: "categoriamaterial", referencedColumnName: "idcategoriamaterial" },
  ])
  categoriamaterial: Categoriamaterial;

  @ManyToOne(() => Tipomaterial, (tipomaterial) => tipomaterial.materials)
  @JoinColumn([
    { name: "tipomaterial", referencedColumnName: "idtipomaterial" },
  ])
  tipomaterial: Tipomaterial;

  @ManyToOne(() => Unidadmedida, (unidadmedida) => unidadmedida.materials)
  @JoinColumn([
    { name: "unidadmedida", referencedColumnName: "idunidadmedida" },
  ])
  unidadmedida: Unidadmedida;
}
