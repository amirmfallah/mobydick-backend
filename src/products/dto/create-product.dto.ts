import { Allow, IsNotEmpty } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @Allow()
  thumbnail: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  available: boolean;

  @Allow()
  bread: { available: boolean; item: string }[];

  @Allow()
  ingredients: { available: boolean; item: string }[];

  @Allow()
  optional: { available: boolean; item: string }[];
}
