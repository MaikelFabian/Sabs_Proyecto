import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { Order } from './order.entity'; // Forward reference, will create later

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'entrada' | 'salida';

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => InventoryItem, (item) => item.transactions)
  @JoinColumn({ name: 'itemId' })
  item: InventoryItem;

  @Column()
  itemId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: number;

  @UpdateDateColumn()
  updatedAt: Date;
}