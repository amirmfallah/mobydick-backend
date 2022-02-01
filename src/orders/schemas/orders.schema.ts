import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Gift } from 'src/gifts/schemas/gifts.schema';
import { Branch } from 'src/branches/schemas/branch.schema';
import { Cart } from 'src/cart/schemas/cart.schema';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  ownerId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Cart.name,
    required: true,
  })
  cartId: string | Cart;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Branch.name,
    required: true,
  })
  branchId: string | Branch;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Gift.name,
  })
  giftId: string | Gift;

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

export const OrderSchema = SchemaFactory.createForClass(Order);
