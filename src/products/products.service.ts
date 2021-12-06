import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    console.log(createProductDto);
    return new this.productModel(createProductDto).save();
  }

  async findAll() {
    return this.productModel.find({});
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
}
