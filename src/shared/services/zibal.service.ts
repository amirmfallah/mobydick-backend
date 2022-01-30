import { ConfigService } from '@nestjs/config';
import { Injectable, Scope } from '@nestjs/common';
@Injectable({
  scope: Scope.DEFAULT,
})
export class ZibalService {
  Zibal = require('zibal');
  zibal = new this.Zibal();
  constructor(private configService: ConfigService) {
    this.zibal.init({
      merchant: this.configService.get('ZIBAL_MERCHENT'),
      callbackUrl: 'https://webhook.site/32a765d8-bf30-4cdd-8c35-b0e5c277b776',
      logLevel: 2,
      // 0: none (default in production)
      // 1: error
      // 2: error + info (default)
    });
  }

  async requestPayment(price: number) {
    const req = await this.zibal.request(price);
    return req;
  }
}
