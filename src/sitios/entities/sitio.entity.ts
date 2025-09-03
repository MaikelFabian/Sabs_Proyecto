// src/sitio/entities/sitio.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TipoSitio } from 'src/tipo-sitio/entities/tipo-sitio.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';

@Entity()
export class Sitio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  tipoSitioId?: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @ManyToOne(() => TipoSitio, (tipoSitio) => tipoSitio.sitios, { nullable: true })
  @JoinColumn({ name: 'tipoSitioId' })
  tipoSitio?: TipoSitio;
  
  @OneToMany(() => Material, (material) => material.sitio)
  materiales?: Material[];

  // Movimientos donde este sitio es el destino
  @OneToMany(() => Movimiento, (movimiento) => movimiento.sitioDestino)
  movimientosDestino?: Movimiento[];

  // Movimientos donde este sitio es el origen
  @OneToMany(() => Movimiento, (movimiento) => movimiento.sitioOrigen)
  movimientosOrigen?: Movimiento[];
}
