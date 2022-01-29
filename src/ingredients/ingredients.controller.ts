import { Roles } from './../shared/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Role } from './../shared/roles.enum';
import { objectIdDto, Pagination } from './../shared/dto/shared.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Controller('api/v1/ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Roles(Role.Super)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return await this.ingredientsService.create(createIngredientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() pagination: Pagination,
    @Query('search') search: string,
  ) {
    return await this.ingredientsService.findAll(pagination, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param() params: objectIdDto) {
    return await this.ingredientsService.findOne(params.id);
  }

  @Roles(Role.Super)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param() params: objectIdDto,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return await this.ingredientsService.update(params.id, updateIngredientDto);
  }

  @Roles(Role.Super)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param() params: objectIdDto) {
    return await this.ingredientsService.remove(params.id);
  }
}
