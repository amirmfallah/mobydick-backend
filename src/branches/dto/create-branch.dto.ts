import { Allow, IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  name: string;

  @Allow()
  description: string;

  @Allow()
  ownerId: string;

  @Allow()
  thumbnail: string;

  @Allow()
  status: boolean;

  @Allow()
  favoriteProducts: string[];

  @Allow()
  sliderPictures: string[];

  @Allow()
  lng: string;

  @Allow()
  lat: string;
}
