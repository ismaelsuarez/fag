import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';

@Injectable()
export class CatalogService {
  constructor(@InjectRepository(ProductEntity) private readonly products: Repository<ProductEntity>) {}

  listProducts() {
    return this.products.find({ take: 50, order: { createdAt: 'DESC' } });
  }

  async getProduct(id: string) {
    const p = await this.products.findOne({ where: { id }, relations: ['variants'] });
    if (!p) throw new NotFoundException();
    return p;
  }
}


