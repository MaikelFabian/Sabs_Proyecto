import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../entities/inventory-item.entity';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(InventoryItem)
    private itemRepository: Repository<InventoryItem>,
  ) {}

  async getLowStockItems(threshold: number = 10) {
    return this.itemRepository.createQueryBuilder('item')
      .where('item.quantity <= :threshold', { threshold })
      .getMany();
  }

  async getInventorySummary() {
    return this.itemRepository.createQueryBuilder('item')
      .select('SUM(item.quantity)', 'totalItems')
      .addSelect('COUNT(item.id)', 'itemCount')
      .getRawOne();
  }

  // Agregar más métodos para alertas en tiempo real, etc.
}