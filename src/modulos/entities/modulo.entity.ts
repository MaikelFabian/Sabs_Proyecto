import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Opcion } from 'src/opciones/entities/opcion.entity';

@Entity('modulos', { schema: 'public' })
export class Modulo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'nombre_modulo', length: 100 })
    nombre_modulo: string;
    @OneToMany(() => Opcion, (opcion) => opcion.modulo)
    opciones: Opcion[];
}