import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';

@Entity()
export class Detalles {
  @PrimaryGeneratedColumn()
  id: number;

  // Información del tipo de movimiento
  @ManyToOne(() => TipoMovimiento, { eager: true })
  @JoinColumn({ name: 'tipoMovimientoId' })
  tipoMovimiento: TipoMovimiento;

  @Column()
  tipoMovimientoId: number;

  // Material y cantidad (solo informativo)
  @ManyToOne(() => Material, { eager: true, nullable: true })
  @JoinColumn({ name: 'materialId' })
  material?: Material;
  
  @Column({ nullable: true })
  materialId?: number;

  @Column()
  cantidad: number;

  // Estado del movimiento (copiado desde Movimiento)
  @Column({ 
    type: 'enum', 
    enum: ['NO_APROBADO', 'APROBADO', 'RECHAZADO']
  })
  estado: 'NO_APROBADO' | 'APROBADO' | 'RECHAZADO';

  // Quien lo solicitó
  @ManyToOne(() => Persona, { eager: true })
  @JoinColumn({ name: 'solicitanteId' })
  solicitante: Persona;

  @Column()
  solicitanteId: number;

  // Fecha de la solicitud
  @CreateDateColumn()
  fecha: Date;

  // Referencia al movimiento original (para trazabilidad)
  @Column()
  movimientoId: number;

  @Column({ default: true })
  activo: boolean;
}
