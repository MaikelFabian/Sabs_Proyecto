// src/material/entities/material.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TipoMaterial } from 'src/tipo-material/entities/tipo-material.entity';
import { UnidadMedida } from 'src/unidad-medida/entities/unidad-medida.entity';
import { CategoriaMaterial } from 'src/categoria-material/entities/categoria-material.entity';
import { Detalle } from 'src/detalles/entities/detalle.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Stock } from 'src/stock/entities/stock.entity';

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;


  @Column({ default: true })
  caduca: boolean;

  @Column({ nullable: true })
  fechaVencimiento?: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: string;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: string;

  @ManyToOne(() => TipoMaterial, (tipo) => tipo.materiales, { nullable: true })
  @JoinColumn({ name: 'tipoMaterialId' })
  tipoMaterial?: TipoMaterial;

  @Column({ nullable: true })
  tipoMaterialId?: number;

  @ManyToOne(() => UnidadMedida, (unidad) => unidad.materiales, {
    nullable: true,
  })
  @JoinColumn({ name: 'unidadMedidaId' })
  unidadMedida?: UnidadMedida;

  @Column({ nullable: true })
  unidadMedidaId?: number;

  @ManyToOne(() => CategoriaMaterial, (categoria) => categoria.materiales, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoriaMaterialId' })
  categoriaMaterial?: CategoriaMaterial;

  @Column({ nullable: true })
  categoriaMaterialId?: number;

  @Column({ default: false })
  requiereDevolucion: boolean;

  @ManyToOne(() => Sitio, { nullable: true })
  @JoinColumn({ name: 'sitioId' })
  sitio?: Sitio;

  @Column({ nullable: true })
  sitioId?: number;

  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'registradoPorId' })
  registradoPor?: Persona;

  @Column({ nullable: true })
  registradoPorId?: number;

  @Column({ default: true })
  esOriginal: boolean;

  @ManyToOne(() => Material, { nullable: true })
  @JoinColumn({ name: 'materialOrigenId' })
  materialOrigen?: Material;

  @Column({ nullable: true })
  materialOrigenId?: number;

  // ✅ NUEVA PROPIEDAD: Cantidad total para materiales prestados (reemplaza stock)
  @Column({ nullable: true })
  cantidadPrestada?: number;

  @OneToMany(() => Stock, (stock) => stock.material)
  stocks?: Stock[];

  @OneToMany(() => Detalle, (detalle) => detalle.material)
  detalles?: Detalle[];

}
