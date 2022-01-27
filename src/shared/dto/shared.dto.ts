import { Allow, IsMongoId } from 'class-validator';

export class objectIdDto {
  @IsMongoId()
  readonly id: string;
}

export class Pagination {
  @Allow()
  page: number;

  @Allow()
  limit: number;
}

export interface Address {
  address: string;
  lat: number;
  lng: number;
  phone: string;
  description: string;
  open: boolean;
}
