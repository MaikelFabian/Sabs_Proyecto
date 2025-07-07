import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Material } from 'src/materiales/entities/materiale.entity';

@Entity('categoriamaterial', { schema: 'public' })
export class Categoriamaterial {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column('text', { name: 'codigoMaterial' })
  codigoMaterial: string;

  @Column('text', { name: 'categoria' })
  categoria: string;

  @Column('boolean', { name: 'activo', nullable: true, default: () => 'true' })
  activo: boolean | null;

  @Column('timestamp without time zone', {
    name: 'fechaCreacion',
    nullable: true,
    default: () => 'now()',
  })
  fechaCreacion: Date | null;

  @Column('timestamp without time zone', {
    name: 'fechaActualizacion',
    nullable: true,
  })
  fechaActualizacion: Date | null;

  @OneToMany(() => Material, (material) => material.categoriamaterial)
  materials: Material[];
}
