import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Detalles } from "src/detalles/entities/detalle.entity";
import { Movimiento } from "src/movimientos/entities/movimiento.entity";
import { Ficha } from "src/fichas/entities/ficha.entity";
import { Rol } from "src/roles/entities/role.entity";

@Entity("persona", { schema: "public" })
export class Persona {
  @PrimaryGeneratedColumn({ name: "idpersona", type: "integer" })
  idpersona: number;

  @Column("text", { name: "identificacion", unique: true })
  identificacion: string;

  @Column("text", { name: "nombre" })
  nombre: string;

  @Column("text", { name: "apellido" })
  apellido: string;

  @Column("text", { name: "telefono", nullable: true })
  telefono: string | null;

  @Column("text", { name: "correo", unique: true })
  correo: string;

  @Column("text", { name: "contrasena" })
  contrasena: string;

  @Column("integer", { name: "edad" })
  edad: number;

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

  @OneToMany(() => Detalles, (detalles) => detalles.personaaprueba)
  detalles: Detalles[];

  @OneToMany(() => Detalles, (detalles) => detalles.personaencargada)
  detalles2: Detalles[];

  @OneToMany(() => Detalles, (detalles) => detalles.personasolicita)
  detalles3: Detalles[];

  @OneToMany(() => Movimiento, (movimiento) => movimiento.movimientopersona)
  movimientos: Movimiento[];

  @ManyToOne(() => Ficha, (ficha) => ficha.personas)
  @JoinColumn([{ name: "ficha", referencedColumnName: "idficha" }])
  ficha: Ficha;

  @ManyToOne(() => Rol, (rol) => rol.personas)
  @JoinColumn([{ name: "rol", referencedColumnName: "idrol" }])
  rol: Rol;
}
