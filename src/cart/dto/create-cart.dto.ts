import { Allow, IsMongoId, isNotEmpty, IsNotEmpty } from 'class-validator';
import { CartItem } from './../interfaces/cart.interface';
export class CreateCartDto {
  @Allow()
  ownerId: string;

  @Allow()
  status: number;

  @IsNotEmpty()
  items: CartItem[];

  @Allow()
  total: number;

  @Allow()
  giftId: string;

  @IsNotEmpty()
  branchId: string;
}
