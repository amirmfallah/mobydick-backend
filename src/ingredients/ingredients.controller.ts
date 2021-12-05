import { objectIdDto } from './../shared/dto/shared.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Controller('api/v1/ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return await this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  async findAll() {
    return await this.ingredientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: objectIdDto) {
    return await this.ingredientsService.findOne(params.id);
  }

  @Patch(':id')
  async update(
    @Param() params: objectIdDto,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return await this.ingredientsService.update(params.id, updateIngredientDto);
  }

  @Delete(':id')
  async remove(@Param() params: objectIdDto) {
    return await this.ingredientsService.remove(params.id);
  }
}
