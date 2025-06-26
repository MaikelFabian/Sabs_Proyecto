import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';
@Entity('rol', { schema: 'public' })
export class Rol {
  @PrimaryGeneratedColumn({ name: 'idrol' })
  idrol: number;

  @Column('text', { name: 'nombrerol' })
  nombrerol: string;

  @Column('boolean', { name: 'activo', nullable: true, default: () => 'true' })
  activo: boolean | null;

  @Column('timestamp without time zone', {
    name: 'fechacreacion',
    nullable: true,
    default: () => 'now()',
  })
  fechacreacion: Date | null;

  @Column('timestamp without time zone', {
    name: 'fechaactualización',
    nullable: true,
  })
  fechaactualizaciN: Date | null;

  @OneToMany(() => Persona, (persona) => persona.rol)
  personas: Persona[];

  @ManyToOne(() => Permiso, (permiso) => permiso.rol)
  permisos: Permiso[];
  @OneToMany(() => RolPermisoOpcion, (rpo) => rpo.rol)
  rolPermisoOpciones: RolPermisoOpcion[];
}
