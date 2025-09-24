import { Body, Controller, Post, Req } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { PaymentsService } from './payments.service';

const preferenceSchema = z.object({ orderId: z.string().uuid(), amount: z.number().positive() });

@Controller('payments/mp')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('preference')
  createPreference(
    @Body(new ZodValidationPipe(preferenceSchema)) body: z.infer<typeof preferenceSchema>
  ) {
    return this.service.createPreference(body.orderId, body.amount);
  }

  @Post('webhook')
  webhook(@Req() req: any) {
    return this.service.handleWebhook(req.body);
  }
}


