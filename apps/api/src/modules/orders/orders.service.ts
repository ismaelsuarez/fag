import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(OrderEntity) private readonly orders: Repository<OrderEntity>) {}

  list() {
    return this.orders.find({ take: 50, order: { createdAt: 'DESC' } });
  }

  async byId(id: string) {
    const o = await this.orders.findOne({ where: { id }, relations: ['items'] });
    if (!o) throw new NotFoundException();
    return o;
  }
}


