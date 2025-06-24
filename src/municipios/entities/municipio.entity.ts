import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Centro } from "src/centros/entities/centro.entity";

@Entity("municipio", { schema: "public" })
export class Municipio {
  @PrimaryGeneratedColumn({ name: "idmunicipio", type: "integer" })
  idmunicipio: number;

  @Column("text", { name: "municipio" })
  municipio: string;

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

  @OneToMany(() => Centro, (centro) => centro.municipio)
  centros: Centro[];
}
