import { Allow, IsMongoId } from 'class-validator';
import { Product } from 'src/cart/interfaces/cart.interface';

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

export interface SearchResponse {
  items: any;
  pages: number;
  limit: number;
  currentPage: number;
  count: number;
}
