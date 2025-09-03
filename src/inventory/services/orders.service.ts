import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Transaction } from '../entities/transaction.entity';
import { InventoryItem } from '../entities/inventory-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto'; // Asumir DTO existe, crear si necesario

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(InventoryItem)
    private itemRepository: Repository<InventoryItem>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      const item = await manager.findOne(InventoryItem, { where: { id: createOrderDto.itemId } });
      if (!item) throw new NotFoundException('Item not found');

      if (createOrderDto.type === 'salida' && item.quantity < createOrderDto.quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const order = manager.create(Order, {
        customerId: createOrderDto.customerId,
        status: 'PENDIENTE',
      });
      const savedOrder = await manager.save(Order, order);

      const transaction = manager.create(Transaction, {
        type: createOrderDto.type,
        quantity: createOrderDto.quantity,
        itemId: createOrderDto.itemId,
        orderId: savedOrder.id,
      });
      await manager.save(Transaction, transaction);

      if (createOrderDto.type === 'entrada') {
        item.quantity += createOrderDto.quantity;
      } else {
        item.quantity -= createOrderDto.quantity;
      }
      await manager.save(InventoryItem, item);

      return savedOrder;
    });
  }

  async findAll() {
    return this.orderRepository.find({ relations: ['transactions', 'transactions.item'] });
  }

  // Agregar más métodos según sea necesario
}