import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Material } from 'src/materiales/entities/materiale.entity';

@Entity()
export class UnidadMedida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unidad: string;

  @Column()
  simbolo: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @OneToMany(() => Material, (material) => material.unidadMedida)
  materiales?: Material[];
}
