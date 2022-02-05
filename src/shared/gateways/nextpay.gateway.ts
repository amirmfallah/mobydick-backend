import { map, Observable, of, lastValueFrom, firstValueFrom } from 'rxjs';
import { PaymentInfo } from './../AbstractPayment';
import { ConfigService } from '@nestjs/config';
import { AbstractPayment } from '../AbstractPayment';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
interface CallbackQuery {
  trans_id: string;
  order_id: string;
  amount: number;
}
@Injectable()
export class NextPayGateway extends AbstractPayment {
  constructor(private configService: ConfigService, private http: HttpService) {
    super(configService.get('NEXTPAY_MERCHENT'));
  }
  getPayment(info: PaymentInfo): Promise<any> {
    const body = {
      api_key: this.merchentId,
      order_id: info.orderId,
      callback_uri: info.callbackUrl,
      amount: info.amount,
    };
    return lastValueFrom(
      this.http.post(`${this.configService.get('NEXTPAY_API')}/token`, body),
    );
  }

  verifyPayment(info: CallbackQuery): Promise<any> {
    return lastValueFrom(
      this.http.post(`${this.configService.get('NEXTPAY_API')}/verify`, {
        api_key: this.merchentId,
        trans_id: info.trans_id,
        amount: info.amount,
      }),
    );
  }

  onPaymentCallback(info: any): Promise<any> {
    return undefined;
  }

  getGatewayUrl(info): string {
    return `${this.configService.get('NEXTPAY_API')}/payment/${info.trans_id}`;
  }
}
