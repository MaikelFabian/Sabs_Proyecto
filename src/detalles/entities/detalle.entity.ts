import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Material } from "src/materiales/entities/materiale.entity";
import { Persona } from "src/personas/entities/persona.entity";

@Entity("detalles", { schema: "public" })
export class Detalles {
  @PrimaryGeneratedColumn({ name: "iddetalle", type: "integer" })
  iddetalle: number;

  @Column("integer", { name: "cantidasolicitada" })
  cantidasolicitada: number;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

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

  @ManyToOne(() => Material, (material) => material.detalles)
  @JoinColumn([{ name: "material", referencedColumnName: "idmaterial" }])
  material: Material;

  @ManyToOne(() => Persona, (persona) => persona.detalles)
  @JoinColumn([{ name: "personaaprueba", referencedColumnName: "idpersona" }])
  personaaprueba: Persona;

  @ManyToOne(() => Persona, (persona) => persona.detalles2)
  @JoinColumn([{ name: "personaencargada", referencedColumnName: "idpersona" }])
  personaencargada: Persona;

  @ManyToOne(() => Persona, (persona) => persona.detalles3)
  @JoinColumn([{ name: "personasolicita", referencedColumnName: "idpersona" }])
  personasolicita: Persona;
}
