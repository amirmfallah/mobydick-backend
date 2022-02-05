import {
  CartItemPopulated,
  CartPopulated,
  Gift,
} from './interfaces/cart.interface';
import { Cart } from './schemas/cart.schema';

export function calculatePrice(cart: Cart & { _id: any }, gift?: Gift) {
  const cartDto = new CartPopulated(cart);
  let total = 0,
    totalDiscount = 0;
  for (let i = 0; i < cartDto.items.length; i++) {
    const elem = <CartItemPopulated>cartDto.items[i];
    let basePrice = elem.productId.price.find(
      (x) => x._id.toString() == elem.option,
    ).price;
    basePrice += elem.bread.reduce((prev, current) => prev + current.price, 0);
    basePrice += elem.optional.reduce(
      (prev, current) => prev + current.price,
      0,
    );
    elem.calculatedPrice = basePrice;
    cartDto.items[i] = <CartItemPopulated>elem;
    total += basePrice * (elem.count || 1);
    if (elem.productId.discount) {
      totalDiscount += basePrice * (elem.productId.discount / 100) * elem.count;
    }
  }

  if (gift) {
    if (gift.amount) {
      totalDiscount += gift.amount;
    } else if (gift.percent) {
      totalDiscount += (total - totalDiscount) * (gift.percent / 100);
    }
  }
  return { total: total, totalDiscount: totalDiscount };
}

export function calculateProductPrice(cart: Cart & { _id: any }) {
  const cartDto = new CartPopulated(cart);

  for (let i = 0; i < cartDto.items.length; i++) {
    const elem = <CartItemPopulated>cartDto.items[i];

    let basePrice = elem.productId.price.find(
      (x) => x._id.toString() == elem.option,
    ).price;
    basePrice += elem.bread.reduce((prev, current) => prev + current.price, 0);
    basePrice += elem.optional.reduce(
      (prev, current) => prev + current.price,
      0,
    );
    elem.calculatedPrice = basePrice;
    cartDto.items[i] = <CartItemPopulated>elem;
  }
  return cartDto;
}
