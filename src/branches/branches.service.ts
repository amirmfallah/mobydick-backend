import { Pagination, SearchResponse } from 'src/shared/dto/shared.dto';
import { Roles } from 'src/shared/roles.decorator';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Branch } from './schemas/branch.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Model } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
    private configService: ConfigService,
  ) {
    this.pageLimit = this.configService.get('PAGE_COUNT');
  }
  pageLimit: number;
  async create(createBranchDto: CreateBranchDto) {
    return new this.branchModel(createBranchDto).save();
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

    const items = await this.branchModel.find(filter, null, query);
    const count = <number>await this.branchModel.count(filter);
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
  }

  async findAllVerified(pagination: Pagination, search?: string) {
    let filter = { verified: true },
      query = {};

    if (search) {
      const regexp = new RegExp(search);
      filter['name'] = regexp;
    }

    if (pagination.page && pagination.page >= 0) {
      query = { skip: pagination.page * this.pageLimit, limit: this.pageLimit };
    }

    const items = await this.branchModel.find(filter, null, query);
    const count = <number>await this.branchModel.count(filter);
    return <SearchResponse>{
      items: items,
      pages: Math.ceil(count / this.pageLimit),
      limit: this.pageLimit,
      currentPage: _.toNumber(pagination.page),
      count: count,
    };
  }

  async findByOwner(ownerId: string) {
    return this.branchModel
      .findOne({ ownerId: ownerId })
      .populate('favoriteProducts')
      .populate('ownerId');
  }

  async findOne(id: string) {
    return this.branchModel
      .findById(id)
      .populate('favoriteProducts')
      .populate('ownerId');
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    return this.branchModel.findByIdAndUpdate(id, updateBranchDto);
  }

  async remove(id: string) {
    return this.branchModel.findByIdAndDelete(id);
  }
}
