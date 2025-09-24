import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../../entities/cart.entity';
import { ProductVariantEntity } from '../../entities/product_variant.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, ProductVariantEntity])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}


