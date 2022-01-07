import { CartItemPopulated, CartPopulated } from './interfaces/cart.interface';
import { Cart } from './schemas/cart.schema';

export function calculatePrice(cart: Cart & { _id: any }) {
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
    cartDto.total += basePrice;
    cartDto.totalDiscount +=
      basePrice * (elem.productId.discount / 100) * elem.count;
  }
  return cartDto;
}
