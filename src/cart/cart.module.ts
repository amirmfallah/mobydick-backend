import { Cart, CartSchema } from './schemas/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  exports: [CartService],
})
export class CartModule {}
