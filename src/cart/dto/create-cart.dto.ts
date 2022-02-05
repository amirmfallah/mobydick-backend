import { CartStatus } from './../interfaces/cart.enum';
import { Allow, IsMongoId, isNotEmpty, IsNotEmpty } from 'class-validator';
import { CartItem } from './../interfaces/cart.interface';
export class CreateCartDto {
  @Allow()
  ownerId: string;

  @IsNotEmpty()
  items: CartItem[];
}
