import { ConfigService } from '@nestjs/config';
import { Injectable, Scope } from '@nestjs/common';
import * as redis from 'redis';

@Injectable({
  scope: Scope.DEFAULT,
})
export class RedisService {
  client: any;

  constructor(private configService: ConfigService) {
    (async () => {
      this.client = redis.createClient({
        url: this.configService.get('REDIS_URI'),
      });
      this.client.on('error', (err) => console.log('Redis Client Error', err));
      await this.client.connect();
    })();
  }

  async set(key: any, value: any, exp?: number) {
    await this.client.set(
      key,
      value,
      exp
        ? {
            EX: exp,
            NX: true,
          }
        : undefined,
    );
  }

  async get(key: any): Promise<any> {
    const result = this.client.get(key);
    return result;
  }

  async delete(key: any): Promise<any> {
    await this.client.del(key);
  }
}
