import { Branch } from './schemas/branch.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Model } from 'mongoose';

@Injectable()
export class BranchesService {
  constructor(@InjectModel(Branch.name) private branchModel: Model<Branch>) {}
  async create(createBranchDto: CreateBranchDto) {
    return new this.branchModel(createBranchDto).save();
  }

  async findAll() {
    return this.branchModel.find({});
  }

  async findOne(id: string) {
    return this.branchModel.findById(id).populate('favoriteProducts');
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    return this.branchModel.findByIdAndUpdate(id, updateBranchDto);
  }

  async remove(id: string) {
    return this.branchModel.findByIdAndDelete(id);
  }
}
