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
export interface AddressDto {
  address: string;
  lat: number;
  lng: number;
  phone: string;
  description: string;
  open: boolean;
}
export interface ShippingAddress {
  address: string;
  lat: number;
  lng: number;
  phone: string;
  description: string;
}
export interface SearchResponse {
  items: any;
  pages: number;
  limit: number;
  currentPage: number;
  count: number;
}
export interface UserDto {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  thumbnail: string;
}
export interface ReportParamDto {
  from?: Date;
  to?: Date;
}
export interface ReportDto {
  totalCount: number;
  totalOpen: number;
  totalSold: number;
}
