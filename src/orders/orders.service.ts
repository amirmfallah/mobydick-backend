import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/orders.schema';
import { Pagination, SearchResponse } from 'src/shared/dto/shared.dto';
import * as _ from 'lodash';

@Injectable()
export class OrdersService {
  pageLimit: number;
  constructor(
    @InjectModel(Order.name) private OrdersModel: Model<Order>,
    private configService: ConfigService,
  ) {
    this.pageLimit = this.configService.get('PAGE_COUNT');
  }
  create(createOrderDto: CreateOrderDto) {
    return new this.OrdersModel(createOrderDto).save();
  }

  async findAll(pagination: Pagination) {
    let query = {};

    if (pagination.page && pagination.page >= 0) {
      query = { skip: pagination.page * this.pageLimit, limit: this.pageLimit };
    }

    const items = await this.OrdersModel
      .find({}, null, query)
      .populate('giftId')
      .populate('branchId');
    const count = <number>await this.OrdersModel.count({});
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
  }

  async findAllByBranch(branchId: string,pagination: Pagination, search?: string) {
    let filter = { banchId: branchId },
    query = {};

    if (pagination.page && pagination.page >= 0) {
      query = { skip: pagination.page * this.pageLimit, limit: this.pageLimit };
    }

    const items = await this.OrdersModel
      .find(filter, null, query)
      .populate('giftId')
      .populate('branchId');
    const count = <number>await this.OrdersModel.count(filter);
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
  }

  findOne(id: string) {
    return this.OrdersModel.findById(id)
    .populate('giftId')
    .populate('branchId');
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.OrdersModel.findByIdAndUpdate(id, updateOrderDto, {new: true});
  }

  remove(id: string) {
    return this.OrdersModel.findByIdAndDelete(id);
  }
}
