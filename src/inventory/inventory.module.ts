import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { Transaction } from './entities/transaction.entity';
import { Order } from './entities/order.entity';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { TrackingService } from './services/tracking.service';
import { TrackingController } from './controllers/tracking.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem, Transaction, Order]),
  ],
  providers: [OrdersService, TrackingService],
  controllers: [OrdersController, TrackingController],
  exports: [OrdersService, TrackingService],
})
export class InventoryModule {}