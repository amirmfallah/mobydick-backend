import { Allow, IsNotEmpty } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @Allow()
  description: string;

  @Allow()
  thumbnail: string;
}
