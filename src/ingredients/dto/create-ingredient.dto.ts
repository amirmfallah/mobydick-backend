import { IsNotEmpty } from 'class-validator';
export class CreateIngredientDto {
  constructor() {
    this.available = false;
  }

  @IsNotEmpty()
  name: string;

  thumbnail: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  available: boolean;
}
