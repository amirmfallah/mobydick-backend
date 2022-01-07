import { CartItemPopulated } from './../interfaces/cart.interface';
import { Ingredients } from './../../ingredients/schemas/ingredients.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { CartItem } from '../interfaces/cart.interface';
import { CartStatus } from '../interfaces/cart.enum';
import { Gift } from 'src/gifts/schemas/gifts.schema';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  ownerId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Gift.name,
  })
  giftId: string | Gift;

  @Prop({
    type: Number,
    required: true,
    default: CartStatus.OPEN,
  })
  status: CartStatus;

  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Product.name,
        },
        bread: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: Ingredients.name,
          },
        ],
        optional: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: Ingredients.name,
          },
        ],
        ingredients: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: Ingredients.name,
          },
        ],
        count: {
          type: Number,
          required: true,
        },
        option: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        _id: false,
      },
    ],
  })
  items: Array<CartItem | CartItemPopulated>;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  total: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalDiscount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
