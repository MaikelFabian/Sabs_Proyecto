import {
    Column,
    Entity,
    Index,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
import { Modulo } from 'src/modulos/entities/modulo.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';


@Entity('opciones', { schema: 'public' })

export class Opcion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'nombre_opcion', length: 100 })
    nombre_opcion: string;

    @Column({ name: 'descripcion', type: 'text', nullable: true })
    descripcion: string;

    @Column({ name: 'ruta_frontend', length: 150 })
    ruta_frontend: string;

    @Column({ name: 'id_modulo' })
    id_modulo: number;

    @ManyToOne(() => Modulo, (modulo) => modulo.opciones)
    @JoinColumn({ name: 'id_modulo' })
    modulo: Modulo;
    @OneToMany(() => Permiso, (permiso) => permiso.opcion)
    permisos: Permiso[];
    @OneToMany(() => RolPermisoOpcion, (rpo) => rpo.opcion)
    rolPermisoOpciones: RolPermisoOpcion[];
}