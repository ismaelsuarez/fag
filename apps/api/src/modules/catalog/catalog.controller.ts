import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  @Get('products')
  list() {
    return this.service.listProducts();
  }

  @Get('products/:id')
  byId(@Param('id') id: string) {
    return this.service.getProduct(id);
  }

  @Get('stock/:variantId')
  stock(@Param('variantId') variantId: string, @Query('branchId') branchId?: string) {
    return this.service.getStock(variantId, branchId);
  }
}


