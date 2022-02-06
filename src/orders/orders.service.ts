import { Gift } from 'src/gifts/schemas/gifts.schema';
import { GiftsService } from './../gifts/gifts.service';
import { CartService } from './../cart/cart.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/orders.schema';
import { Pagination, SearchResponse } from 'src/shared/dto/shared.dto';
import * as _ from 'lodash';
import { CartStatus } from 'src/cart/interfaces/cart.enum';
import { calculatePrice } from 'src/cart/functions.helper';

@Injectable()
export class OrdersService {
  pageLimit: number;
  constructor(
    @InjectModel(Order.name) private OrdersModel: Model<Order>,
    private configService: ConfigService,
    private cartService: CartService,
    private giftService: GiftsService,
  ) {
    this.pageLimit = this.configService.get('PAGE_COUNT');
  }
  async create(createOrderDto: CreateOrderDto) {
    let giftObj;
    const cartObj = await this.cartService.findOne(createOrderDto.cartId);
    if (!cartObj) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    if (createOrderDto.giftId) {
      giftObj = await this.giftService.findOne(createOrderDto.giftId);
    }
    const priceObj = calculatePrice(cartObj, giftObj);
    createOrderDto.total = priceObj.total;
    createOrderDto.totalDiscount = priceObj.totalDiscount;
    createOrderDto.orderId = 'MD' + Math.floor(Date.now() / 1000).toString();
    const order = await new this.OrdersModel(createOrderDto).save();
    const orderObj = order.toObject();
    orderObj.total = priceObj.total;
    orderObj.totalDiscount = priceObj.totalDiscount;
    return orderObj;
  }

  async findAll(pagination: Pagination) {
    const filter = {},
      query = {};

    if (pagination.page && pagination.page >= 0) {
      query['skip'] = pagination.page * this.pageLimit;
      query['limit'] = this.pageLimit;
    }

    const items = await this.OrdersModel.find(filter, null, query).populate([
      'giftId',
      'branchId',
      'ownerId',
      'addressId',
    ]);
    const count = <number>await this.OrdersModel.count(filter);
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
  }

  async findAllByUser(userId: string) {
    const order = this.OrdersModel.find({ ownerId: userId }).populate([
      'giftId',
      'branchId',
      'ownerId',
      'addressId',
    ]);
    return await order.populate({
      path: 'cartId',
      populate: { path: 'items.productId', select: ['thumbnail'] },
    });
  }

  async findAllByBranch(branchId: string, pagination: Pagination) {
    const filter = { branchId: branchId },
      query = {};

    if (pagination.page && pagination.page >= 0) {
      query['skip'] = pagination.page * this.pageLimit;
      query['limit'] = this.pageLimit;
    }

    const items = await this.OrdersModel.find(filter, null, query).populate([
      'giftId',
      'branchId',
      'ownerId',
      'addressId',
    ]);
    const count = <number>await this.OrdersModel.count(filter);
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
  }

  async findOne(id: string) {
    const order = await this.OrdersModel.findById(id)
      .populate('giftId')
      .populate('branchId')
      .populate('cartId')
      .populate('addressId')
      .populate('ownerId');

    const orderObj = order.toObject();
    const cartObj = await this.cartService.findOne(<string>orderObj.cartId);
    const priceObj = calculatePrice(cartObj, <Gift>orderObj.giftId);
    _.set(orderObj, 'total', priceObj.total);
    _.set(orderObj, 'totalDiscount', priceObj.totalDiscount);
    return orderObj;
  }

  async findOpenByUser(userId: string, cartId?: string) {
    const query = {
      ownerId: userId,
      status: CartStatus.OPEN,
    };
    if (cartId) {
      query['cartId'] = cartId;
    }
    const order = await this.OrdersModel.findOne(query)
      .populate('giftId')
      .populate('branchId')
      .populate('addressId');

    if (!order) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const orderObj = order.toObject();
    const cartObj = await this.cartService.findOne(<string>orderObj.cartId);
    const priceObj = calculatePrice(cartObj, <Gift>orderObj.giftId);
    _.set(orderObj, 'total', priceObj.total);
    _.set(orderObj, 'totalDiscount', priceObj.totalDiscount);
    return orderObj;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.OrdersModel.findByIdAndUpdate(id, updateOrderDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.OrdersModel.findByIdAndDelete(id);
  }
}
