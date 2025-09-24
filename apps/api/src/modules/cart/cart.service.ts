import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../../entities/cart.entity';
import { ProductVariantEntity } from '../../entities/product_variant.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity) private readonly carts: Repository<CartEntity>,
    @InjectRepository(ProductVariantEntity) private readonly variants: Repository<ProductVariantEntity>
  ) {}

  async getCurrent() {
    let cart = await this.carts.findOne({ where: {} });
    if (!cart) {
      cart = this.carts.create({ items: [] });
      await this.carts.save(cart);
    }
    return cart;
  }

  async addItem(variantId: string, quantity: number) {
    const variant = await this.variants.findOne({ where: { id: variantId }, relations: ['product'] });
    if (!variant) throw new NotFoundException('Variant not found');
    const cart = await this.getCurrent();
    const existing = cart.items.find((i) => i.variantId === variantId);
    if (existing) existing.quantity += quantity;
    else cart.items.push({ variantId, quantity });
    await this.carts.save(cart);
    return cart;
  }
}


