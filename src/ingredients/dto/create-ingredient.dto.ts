import { Allow, IsNotEmpty } from 'class-validator';
export class CreateIngredientDto {
  constructor() {
    this.available = false;
  }

  @IsNotEmpty()
  name: string;

  thumbnail: string;

  @IsNotEmpty()
  price: number;

  @Allow()
  available: boolean;
}
