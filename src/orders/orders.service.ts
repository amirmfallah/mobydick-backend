import { ReportParamDto } from './../shared/dto/shared.dto';
import { Gift } from 'src/gifts/schemas/gifts.schema';
import { GiftsService } from './../gifts/gifts.service';
import { CartService } from './../cart/cart.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto, Filter } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/orders.schema';
import { Pagination, SearchResponse } from 'src/shared/dto/shared.dto';
import * as _ from 'lodash';
import { CartStatus } from 'src/cart/interfaces/cart.enum';
import { calculatePrice } from 'src/cart/functions.helper';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class OrdersService {
  pageLimit: number;
  constructor(
    @InjectModel(Order.name) private OrdersModel: Model<Order>,
    private configService: ConfigService,
    private cartService: CartService,
    private giftService: GiftsService,
    private usersService: UsersService,
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

  async findAll(pagination: Pagination, search?: string) {
    let filter = {};
    const query = {};

    console.log(search);
    if (search) {
      let searchObj: Filter;
      try {
        searchObj = JSON.parse(search);
      } catch (err) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
      filter = _.mapValues(searchObj, (value) => new RegExp(value));

      if (searchObj.phone) {
        const user = await this.usersService.searchUserByPhone(searchObj.phone);
        if (user) {
          searchObj.ownerId = user._id;
        } else {
          searchObj.ownerId = '4edd40c86762e0fb12000003';
        }
        filter['ownerId'] = searchObj.ownerId;
      }

      if (searchObj.branchId) {
        filter['branchId'] = searchObj.branchId;
      }
    }

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

  async findAllByBranch(
    branchId: string,
    pagination: Pagination,
    search?: string,
  ) {
    let filter = {};
    const query = {};

    if (search) {
      let searchObj: Filter;
      try {
        searchObj = JSON.parse(search);
      } catch (err) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
      filter = _.mapValues(searchObj, (value) => new RegExp(value));

      if (searchObj.phone) {
        const user = await this.usersService.searchUserByPhone(searchObj.phone);
        if (user) {
          searchObj.ownerId = user._id;
        } else {
          searchObj.ownerId = '4edd40c86762e0fb12000003';
        }
        filter['ownerId'] = searchObj.ownerId;
      }

      if (searchObj.branchId) {
        filter['branchId'] = searchObj.branchId;
      }
    }
    filter['branchId'] = branchId;
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

  async reportByBranch(branchId: string, query: ReportParamDto) {
    return this.OrdersModel.find({
      branchId: branchId,
      createdAt: { $gt: query.from, $lt: query.to },
    });
  }
}
