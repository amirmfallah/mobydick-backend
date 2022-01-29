import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { Pagination, SearchResponse } from 'src/shared/dto/shared.dto';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class CartService {
  pageLimit: number;
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private configService: ConfigService,
  ) {
    this.pageLimit = this.configService.get('PAGE_COUNT');
  }

  async create(createCartDto: CreateCartDto) {
    return new this.cartModel(createCartDto).save();
  }

  async findAll(pagination: Pagination) {
    let query = {};

    if (pagination.page && pagination.page >= 0) {
      query = { skip: pagination.page * this.pageLimit, limit: this.pageLimit };
    }

    const items = await this.cartModel.find({}, null, query);
    const count = <number>await this.cartModel.count({});
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
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

  async findAllByBranch(branchId: string, pagination: Pagination) {
    let query = {};

    if (pagination.page && pagination.page >= 0) {
      query = { skip: pagination.page * this.pageLimit, limit: this.pageLimit };
    }

    const items = await this.cartModel.find({}, null, query);
    const count = <number>await this.cartModel.count({ branchId: branchId });
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
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
