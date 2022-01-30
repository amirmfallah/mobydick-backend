import { Pagination, SearchResponse } from 'src/shared/dto/shared.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoriesService {
  pageLimit: number;

  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private configService: ConfigService,
  ) {
    this.pageLimit = this.configService.get('PAGE_COUNT');
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return await new this.categoryModel(createCategoryDto).save();
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

    const items = await this.categoryModel.find(filter, null, query);
    const count = <number>await this.categoryModel.count({});
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
  }

  async findOne(id: string) {
    return await this.categoryModel.findById(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto);
  }

  async remove(id: string) {
    return await this.categoryModel.findByIdAndDelete(id);
  }
}
