import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Material } from 'src/materiales/entities/materiale.entity';

@Entity('unidadmedida', { schema: 'public' })
export class Unidadmedida {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column('text', { name: 'unidadmedida' })
  unidadmedida: string;

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

  @OneToMany(() => Material, (material) => material.unidadmedida)
  materials: Material[];
}
