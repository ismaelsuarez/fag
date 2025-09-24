import { Body, Controller, Get, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CartService } from './cart.service';

const addSchema = z.object({ variantId: z.string().uuid(), quantity: z.number().int().min(1) });

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get()
  get() {
    return this.service.getCurrent();
  }

  @Post('add')
  add(@Body(new ZodValidationPipe(addSchema)) body: z.infer<typeof addSchema>) {
    return this.service.addItem(body.variantId, body.quantity);
  }
}


