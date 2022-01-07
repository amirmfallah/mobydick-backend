import { Allow } from 'class-validator';

export class CreateAddressDto {
  @Allow()
  ownerId: string;

  @Allow()
  lat: number;

  @Allow()
  lng: number;

  @Allow()
  address: string;

  @Allow()
  phone: string;

  @Allow()
  description: string;
}
