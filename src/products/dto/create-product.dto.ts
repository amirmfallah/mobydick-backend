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
  bread: { required: boolean; item: string; included: boolean }[];

  @Allow()
  ingredients: { required: boolean; item: string; included: boolean }[];

  @Allow()
  optional: { required: boolean; item: string; included: boolean }[];
}
