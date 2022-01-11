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
