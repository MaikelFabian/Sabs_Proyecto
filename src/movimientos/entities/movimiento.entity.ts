import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity';

@Entity()
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number;

  // Material solicitado
  @ManyToOne(() => Material, { eager: true })
  @JoinColumn({ name: 'materialId' })
  material: Material;

  @Column()
  materialId: number;

  // Cantidad solicitada
  @Column()
  cantidad: number;

  // Fecha de la petición
  @CreateDateColumn()
  fechaPeticion: Date;

  // Tipo de movimiento (Entrada, Salida, Préstamo, Devolución)
  @ManyToOne(() => TipoMovimiento, { eager: true })
  @JoinColumn({ name: 'tipoMovimientoId' })
  tipoMovimiento: TipoMovimiento;

  @Column()
  tipoMovimientoId: number;

  // Estado del movimiento (por defecto: NO_APROBADO)
  @Column({ 
    type: 'enum', 
    enum: ['NO_APROBADO', 'APROBADO', 'RECHAZADO'],
    default: 'NO_APROBADO'
  })
  estado: 'NO_APROBADO' | 'APROBADO' | 'RECHAZADO';

  // Sitio al cual va dirigido
  @ManyToOne(() => Sitio, { eager: true })
  @JoinColumn({ name: 'sitioDestinoId' })
  sitioDestino: Sitio;

  @Column()
  sitioDestinoId: number;

  // Persona que hace la solicitud
  @ManyToOne(() => Persona, { eager: true })
  @JoinColumn({ name: 'solicitanteId' })
  solicitante: Persona;

  @Column()
  solicitanteId: number;

  // Persona que aprueba (a quien le llega el movimiento)
  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'aprobadorId' })
  aprobador?: Persona;

  @Column({ nullable: true })
  aprobadorId?: number;

  // Descripción opcional del movimiento
  @Column({ nullable: true })
  descripcion?: string;

  // Sitio de origen (para devoluciones y préstamos)
  @ManyToOne(() => Sitio, { nullable: true })
  @JoinColumn({ name: 'sitioOrigenId' })
  sitioOrigen?: Sitio;

  @Column({ nullable: true })
  sitioOrigenId?: number;

  @Column({ default: true })
  activo: boolean;

  @UpdateDateColumn({ nullable: true })
  fechaActualizacion?: Date;

  @Column({ nullable: true })
  materialPrestamoId?: number;
  
  @ManyToOne(() => Material, { nullable: true })
  @JoinColumn({ name: 'materialPrestamoId' })
  materialPrestamo?: Material;
}
