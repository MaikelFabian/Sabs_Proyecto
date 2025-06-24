import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Areacentro } from "src/area-centro/entities/area-centro.entity";
import { Municipio } from "src/municipios/entities/municipio.entity";
import { Sede } from "src/sedes/entities/sede.entity";

@Entity("centro", { schema: "public" })
export class Centro {
  @PrimaryGeneratedColumn({ name: "idcentro", type: "integer" })
  idcentro: number;

  @Column("text", { name: "centro" })
  centro: string;

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

  @OneToMany(() => Areacentro, (areacentro) => areacentro.centro)
  areacentros: Areacentro[];

  @ManyToOne(() => Municipio, (municipio) => municipio.centros)
  @JoinColumn([{ name: "municipio", referencedColumnName: "idmunicipio" }])
  municipio: Municipio;

  @OneToMany(() => Sede, (sede) => sede.centro)
  sedes: Sede[];
}
