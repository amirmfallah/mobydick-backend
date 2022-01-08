import { IngredientItem } from './../../../dist/cart/interfaces/cart.interface.d';
import { Allow, IsNotEmpty } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @Allow()
  thumbnail: string;

  @IsNotEmpty()
  price: {
    available: boolean;
    optionName: string;
    price: number;
  }[];

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
