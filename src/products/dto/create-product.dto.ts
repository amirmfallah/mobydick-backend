import { priceItem } from './../../cart/interfaces/cart.interface';
import { Allow, IsNotEmpty } from 'class-validator';
import { IngredientItem } from 'src/cart/interfaces/cart.interface';
export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @Allow()
  thumbnail: string;

  @IsNotEmpty()
  price: priceItem[];

  @Allow()
  discount: number;

  @IsNotEmpty()
  available: boolean;

  @Allow()
  category: string;

  @Allow()
  bread: IngredientItem[];

  @Allow()
  ingredients: IngredientItem[];

  @Allow()
  optional: IngredientItem[];
}
