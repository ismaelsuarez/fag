import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProductVariantEntity } from '../entities/product_variant.entity';

@Injectable()
export class AnmatGuard implements CanActivate {
  constructor(
    @InjectRepository(ProductVariantEntity)
    private readonly variantsRepo: Repository<ProductVariantEntity>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body ?? {};
    const items: Array<{ variantId: string; quantity: number }> = body.items ?? [];
    if (items.length === 0) return true;
    const ids = items.map((i) => i.variantId);
    const variants = await this.variantsRepo.find({ where: { id: In(ids) }, relations: ['product'] });
    const requiresRx = variants.some((v) => v.product?.rxRequired);
    if (requiresRx && !body.prescriptionId) {
      throw new UnauthorizedException('Prescription required for RX products');
    }
    return true;
  }
}


