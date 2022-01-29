import { Pagination, SearchResponse } from './../shared/dto/shared.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ingredients } from './schemas/ingredients.schema';
import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
@Injectable()
export class IngredientsService {
  pageLimit: number;
  constructor(
    @InjectModel(Ingredients.name) private ingredientsModel: Model<Ingredients>,
    private configService: ConfigService,
  ) {
    this.pageLimit = this.configService.get('PAGE_COUNT');
  }

  async create(createIngredientDto: CreateIngredientDto) {
    return new this.ingredientsModel(createIngredientDto).save();
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

    const items = await this.ingredientsModel.find(filter, null, query);
    const count = <number>await this.ingredientsModel.count({});
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
  }

  async findOne(id: string) {
    return this.ingredientsModel.findById(id);
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsModel.findByIdAndUpdate(id, updateIngredientDto);
  }

  async remove(id: string) {
    return this.ingredientsModel.findByIdAndRemove(id);
  }
}
