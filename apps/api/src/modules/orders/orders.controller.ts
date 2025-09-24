import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.service.byId(id);
  }
}


