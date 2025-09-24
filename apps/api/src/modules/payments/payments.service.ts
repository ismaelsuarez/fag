import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  createPreference(orderId: string, amount: number) {
    // Stub de MercadoPago preference creation
    return { id: 'pref-123', orderId, amount };
  }

  handleWebhook(payload: unknown) {
    return { ok: true };
  }
}


