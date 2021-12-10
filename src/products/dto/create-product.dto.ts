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

  @Allow()
  discount: number;

  @IsNotEmpty()
  available: boolean;

  @Allow()
  category: string;

  @Allow()
  bread: { available: boolean; item: string; included: boolean }[];

  @Allow()
  ingredients: { available: boolean; item: string; included: boolean }[];

  @Allow()
  optional: { available: boolean; item: string; included: boolean }[];
}
