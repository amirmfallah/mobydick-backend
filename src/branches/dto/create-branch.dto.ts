import { Allow, IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  name: string;

  @Allow()
  description: string;

  @Allow()
  thumbnail: string;

  @Allow()
  status: boolean;

  @Allow()
  favoriteProducts: string[];

  @Allow()
  sliderPictures: string[];
}
