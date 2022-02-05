import { CartStatus } from './../../cart/interfaces/cart.enum';
import { IsNotEmpty, Allow } from 'class-validator';
export class CreateOrderDto {
  ownerId: string;

  @IsNotEmpty()
  cartId: string;

  @IsNotEmpty()
  branchId: string;

  @Allow()
  giftId: string;

  total: number;

  totalDiscount: number;

  @IsNotEmpty()
  addressId: string;

  status: CartStatus;

  payment: any;

  trans_id: string;
}
