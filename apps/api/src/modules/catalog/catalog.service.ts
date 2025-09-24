import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { StockItemEntity } from '../../entities/stock_item.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(ProductEntity) private readonly products: Repository<ProductEntity>,
    @InjectRepository(StockItemEntity) private readonly stock: Repository<StockItemEntity>
  ) {}

  listProducts() {
    return this.products.find({ take: 50, order: { createdAt: 'DESC' } });
  }

  async getProduct(id: string) {
    const p = await this.products.findOne({ where: { id }, relations: ['variants'] });
    if (!p) throw new NotFoundException();
    return p;
  }

  async getStock(variantId: string, branchId?: string) {
    const where: any = { variant: { id: variantId } };
    if (branchId) where.branch = { id: branchId };
    const items = await this.stock.find({ where, relations: ['branch', 'variant'] });
    const total = items.reduce((sum, it) => sum + it.quantity, 0);
    return { total, byBranch: items.map((it) => ({ branchId: it.branch.id, quantity: it.quantity })) };
  }
}


