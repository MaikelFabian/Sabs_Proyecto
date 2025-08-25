import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Persona } from '../../personas/entities/persona.entity'; // Reuse existing Persona for Customer/Supplier
import { Transaction } from './transaction.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderDate: Date;

  @ManyToOne(() => Persona)
  @JoinColumn({ name: 'customerId' })
  customer: Persona;

  @Column()
  customerId: number;

  @Column()
  status: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'ENTREGADA';

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  transactions: Transaction[];

  @UpdateDateColumn()
  updatedAt: Date;
}