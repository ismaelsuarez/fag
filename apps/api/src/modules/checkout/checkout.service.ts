import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckoutService {
  validate(payload: unknown) {
    return { ok: true, payload };
  }
}


