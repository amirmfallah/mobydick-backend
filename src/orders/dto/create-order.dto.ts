import { CartStatus } from './../../cart/interfaces/cart.enum';
import { IsNotEmpty, Allow } from 'class-validator';
export class CreateOrderDto {
  orderId: string;
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

  @Allow()
  status: CartStatus;

  payment: any;

  trans_id: string;
}

export interface Filter {
  phone?: string;
  status?: CartStatus;
  orderId?: string;
  ownerId?: string;
  branchId?: string;
}
