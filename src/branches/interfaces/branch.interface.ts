import { Product } from './../../products/schemas/product.schema';
export interface branchSearchItem {
  _id: string;
  name: string;
  thumbnail: string;
}

export interface branchItem {
  _id: string;
  name: string;
  thumbnail: string;
  description: string;
  status: boolean;
  favoriteProducts: Product[];
  sliderPictures: string[];
}