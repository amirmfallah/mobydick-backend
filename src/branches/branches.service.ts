import { Branch } from './schemas/branch.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Model } from 'mongoose';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
  ) {}
  async create(createBranchDto: CreateBranchDto) {
    return await new this.branchModel(createBranchDto).save();
  }

  async findAll() {
    return await this.branchModel.find({});
  }

  async findOne(id: string) {
    return  await this.branchModel.findById(id).populate('favoriteProducts');
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    return await this.branchModel.findByIdAndUpdate(id, updateBranchDto);
  }

  async remove(id: string) {
    return await this.branchModel.findByIdAndDelete(id);
  }
}
