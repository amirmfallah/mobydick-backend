import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/orders.schema';
import { NextPayGateway } from 'src/shared/gateways/nextpay.gateway';
import { HttpModule } from '@nestjs/axios';
import { GiftsModule } from 'src/gifts/gifts.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  controllers: [OrdersController],
  providers: [NextPayGateway, OrdersService],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    HttpModule,
    CartModule,
    GiftsModule,
  ],
})
export class OrdersModule {}
