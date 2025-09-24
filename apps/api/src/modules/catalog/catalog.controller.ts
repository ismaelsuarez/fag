import { Controller, Get, Param } from '@nestjs/common';
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
}


