import { Allow, IsNotEmpty } from 'class-validator';
import { AddressDto } from 'src/shared/dto/shared.dto';

export class CreateBranchDto {
  @IsNotEmpty()
  name: string;

  @Allow()
  description: string;

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
  address: AddressDto;
}
