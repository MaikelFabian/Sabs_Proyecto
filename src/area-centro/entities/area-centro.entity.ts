import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Centro } from 'src/centros/entities/centro.entity';
import { Area } from 'src/areas/entities/area.entity';

@Entity()
export class AreaCentro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  centroId?: number;

  @Column({ nullable: true })
  areaId?: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => Centro, (centro) => centro.areasCentro, { nullable: true })
  @JoinColumn({ name: 'centroId' })
  centro?: Centro;

  @ManyToOne(() => Area, (area) => area.areasCentro, { nullable: true })
  @JoinColumn({ name: 'areaId' })
  area?: Area;
}
