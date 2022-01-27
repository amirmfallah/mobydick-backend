import { Allow, IsNotEmpty } from 'class-validator';
import { Address } from 'src/shared/dto/shared.dto';

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
  address: Address;
}
