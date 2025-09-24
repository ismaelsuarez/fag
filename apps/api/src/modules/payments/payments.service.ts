import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  createPreference(orderId: string, amount: number) {
    // Stub de MercadoPago preference creation
    const id = 'pref-123';
    return { id, orderId, amount, init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${id}` };
  }

  handleWebhook(payload: unknown) {
    return { ok: true };
  }
}


