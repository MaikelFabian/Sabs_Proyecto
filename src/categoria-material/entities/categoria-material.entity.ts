// src/categoria-material/entities/categoria-material.entity.ts
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
export class CategoriaMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  categoria: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @OneToMany(() => Material, (material) => material.categoriaMaterial)
  materiales?: Material[];
}
