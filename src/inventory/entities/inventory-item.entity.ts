import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Transaction } from './transaction.entity'; // Forward reference, will create later
import { Sitio } from '../../sitios/entities/sitio.entity'; // Reuse existing Sitio for StockLocation

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('decimal')
  unitPrice: number;

  @Column('int')
  quantity: number;

  @ManyToOne(() => Sitio)
  @JoinColumn({ name: 'stockLocationId' })
  stockLocation: Sitio;

  @Column()
  stockLocationId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.item)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}