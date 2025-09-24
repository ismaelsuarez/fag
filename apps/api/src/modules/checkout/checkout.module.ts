import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantEntity } from '../../entities/product_variant.entity';
import { AnmatGuard } from '../../guards/anmat.guard';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantEntity])],
  controllers: [CheckoutController],
  providers: [CheckoutService, AnmatGuard]
})
export class CheckoutModule {}


