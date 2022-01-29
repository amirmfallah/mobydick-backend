import { ConfigService } from '@nestjs/config';
import { Pagination, SearchResponse } from './../shared/dto/shared.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import * as _ from 'lodash';
@Injectable()
export class ProductsService {
  pageLimit: number;
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private configService: ConfigService,
  ) {
    this.pageLimit = this.configService.get('PAGE_COUNT');
  }

  async create(createProductDto: CreateProductDto) {
    return new this.productModel(createProductDto).save();
  }

  async findAll(pagination: Pagination, search?: string) {
    let filter = {},
      query = {};

    if (search) {
      const regexp = new RegExp(search);
      filter = { name: regexp };
    }

    if (pagination.page && pagination.page >= 0) {
      query = { skip: pagination.page * this.pageLimit, limit: this.pageLimit };
    }

    const items = await this.productModel.find(filter, null, query);
    const count = <number>await this.productModel.count({});
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
  }

  async findOne(id: string) {
    return this.productModel
      .findById(id)
      .populate('bread.item')
      .populate('optional.item')
      .populate('ingredients.item');
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.productModel.findByIdAndUpdate(id, updateProductDto);
  }

  async remove(id: string) {
    return await this.productModel.findByIdAndDelete(id);
  }

  async findProductsByCaregory(categoryId: string) {
    return await this.productModel.find({ category: categoryId });
  }
}
