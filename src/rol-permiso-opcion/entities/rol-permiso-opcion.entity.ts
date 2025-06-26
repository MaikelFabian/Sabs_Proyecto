import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Rol } from 'src/roles/entities/role.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { Opcion } from 'src/opciones/entities/opcion.entity';

@Entity('rol_permiso_opcion') // nombre exacto de la tabla en la base de datos
export class RolPermisoOpcion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Rol, (rol) => rol.rolPermisoOpciones, { eager: false })
    @JoinColumn({ name: 'id_rol' })
    rol: Rol;

    @ManyToOne(() => Permiso, (permiso) => permiso.rolPermisoOpciones, { eager: false })
    @JoinColumn({ name: 'id_permiso' })
    permiso: Permiso;

    @ManyToOne(() => Opcion, (opcion) => opcion.rolPermisoOpciones)
    @JoinColumn({ name: 'id_opcion' })
    opcion: Opcion;
}
