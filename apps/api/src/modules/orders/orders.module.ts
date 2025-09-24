import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { OrderItemEntity } from '../../entities/order_item.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}


