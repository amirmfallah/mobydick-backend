import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './schemas/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}
  async create(createCartDto: CreateCartDto) {
    return new this.cartModel(createCartDto).save();
  }

  async findAll() {
    return this.cartModel.find({});
  }

  async findOneOpenCart(owner: string) {
    return this.cartModel
      .findOne({ ownerId: owner, status: 0 })
      .populate('items.productId')
      .populate('items.bread')
      .populate('items.ingredients')
      .populate('items.optional')
      .populate('giftId')
      .populate('branchId');
  }

  async findAllByOwner(id: string) {
    return this.cartModel.find({ ownerId: id }).exec();
  }

  async findOne(id: string) {
    return this.cartModel.findById(id);
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    return this.cartModel
      .findByIdAndUpdate(id, updateCartDto, { new: true })
      .populate('items.productId')
      .populate('items.bread')
      .populate('items.ingredients')
      .populate('items.optional')
      .populate('giftId')
      .populate('branchId');
  }

  async remove(id: string) {
    return this.cartModel.findByIdAndDelete(id);
  }
}
