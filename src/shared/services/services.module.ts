import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ZibalService } from './zibal.service';

@Module({
  providers: [RedisService, ZibalService],
  imports: [],
  exports: [RedisService, ZibalService],
})
export class ServicesModule {}
