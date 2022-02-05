import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

export interface PaymentInfo {
  amount: number;
  orderId: string;
  callbackUrl: string;
}

@Injectable()
export abstract class AbstractPayment {
  merchentId;

  constructor(merchentId: string) {
    this.merchentId = merchentId;
  }

  abstract getPayment(info): Promise<any>;
  abstract verifyPayment(info): Promise<any>;
  abstract onPaymentCallback(info): Promise<any>;
  abstract getGatewayUrl(info): string;
}
