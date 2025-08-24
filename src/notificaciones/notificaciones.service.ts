import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notificacion)
    private notificationsRepository: Repository<Notificacion>,
  ) {}

  async findByUser(userId: number): Promise<Notificacion[]> {
    return this.notificationsRepository.find({
      where: { persona: { id: userId } },
      order: { id: 'DESC' }, 
    });
  }

  // Otros métodos, como markAsRead, etc.
}