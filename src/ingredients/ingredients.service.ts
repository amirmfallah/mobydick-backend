import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Ingredients } from './schemas/ingredients.schema';
import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredients.name) private ingredientsModel: Model<Ingredients>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    return new this.ingredientsModel(createIngredientDto).save();
  }

  async findAll() {
    return this.ingredientsModel.find({});
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
