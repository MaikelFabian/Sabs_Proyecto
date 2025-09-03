import { Controller, Get, Query } from '@nestjs/common';
import { TrackingService } from '../services/tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('low-stock')
  async getLowStock(@Query('threshold') threshold: number = 10) {
    return this.trackingService.getLowStockItems(threshold);
  }

  @Get('summary')
  async getSummary() {
    return this.trackingService.getInventorySummary();
  }

  // Agregar más endpoints según sea necesario
}