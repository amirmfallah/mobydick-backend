import { Cart } from '../schemas/cart.schema';

export interface CartItem {
  productId: string;
  bread: string[];
  optional: string[];
  ingredients: string[];
  option: string;
  count: number;
}

export interface Ingredients {
  _id: string;
  name: string;
  thumbnail?: string;
  price: number;
  available: boolean;
}
export interface IngredientItem {
  item: Ingredients;
  required: boolean;
  included: boolean;
  forOption?: number;
}

export interface priceItem {
  _id?: string;
  optionName: string;
  price: number;
  index: number;
}
export interface Product {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  price: Array<priceItem>;
  discount: number;
  available: boolean;
  category: string;
  bread?: Array<IngredientItem>;
  ingredients?: Array<IngredientItem>;
  optional?: Array<IngredientItem>;
}
export interface CartItemPopulated {
  productId: Product;
  bread: Array<Ingredients>;
  optional: Array<Ingredients>;
  ingredients: Array<Ingredients>;
  option: string;
  count: number;
  calculatedPrice?: number;
}

export interface CartDto {
  _id: string;
  ownerId: string;
  items: CartItemPopulated[];
}

export interface Gift {
  validUntil: Date;
  code: string;
  amount?: number;
  percent?: number;
}

export class CartPopulated {
  _id: string;
  ownerId: string;
  items: Array<CartItem | CartItemPopulated>;

  constructor(cart: Cart & { _id: any }) {
    const cartObj = cart.toObject();
    this._id = cartObj._id.toString();
    this.ownerId = cartObj.ownerId.toString();
    this.items = cartObj.items;
  }

  toDto() {
    return <CartDto>{
      _id: this._id,
      items: this.items,
      ownerId: this.ownerId,
    };
  }
}
