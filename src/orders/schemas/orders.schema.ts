import { CartStatus } from './../../cart/interfaces/cart.enum';
import { AddressDto } from 'src/shared/dto/shared.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Gift } from 'src/gifts/schemas/gifts.schema';
import { Branch } from 'src/branches/schemas/branch.schema';
import { Cart } from 'src/cart/schemas/cart.schema';
import { Address } from 'src/addresses/schemas/address.schema';

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
    type: mongoose.Schema.Types.ObjectId,
    ref: Address.name,
  })
  addressId: string | AddressDto;

  @Prop({
    type: String,
    required: true,
    default: CartStatus.OPEN,
  })
  status: CartStatus;

  total: number;
  totalDiscount: number;

  @Prop({
    type: Object,
  })
  payment: any;

  @Prop({
    type: String,
  })
  trans_id: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
