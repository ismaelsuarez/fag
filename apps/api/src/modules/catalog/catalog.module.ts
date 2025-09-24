import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { ProductVariantEntity } from '../../entities/product_variant.entity';
import { StockItemEntity } from '../../entities/stock_item.entity';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductVariantEntity, StockItemEntity])],
  controllers: [CatalogController],
  providers: [CatalogService]
})
export class CatalogModule {}


