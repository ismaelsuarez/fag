import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AnmatGuard } from '../../guards/anmat.guard';
import { CheckoutService } from './checkout.service';

const validateSchema = z.object({
  items: z.array(z.object({ variantId: z.string().uuid(), quantity: z.number().int().min(1) })),
  prescriptionId: z.string().uuid().optional()
});

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly service: CheckoutService) {}

  @UseGuards(AnmatGuard)
  @Post('validate')
  validate(@Body(new ZodValidationPipe(validateSchema)) body: z.infer<typeof validateSchema>) {
    return this.service.validate(body);
  }
}


