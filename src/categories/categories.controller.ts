import { ProductsService } from './../products/products.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Role } from './../shared/roles.enum';
import { Roles } from './../shared/roles.decorator';
import { objectIdDto } from './../shared/dto/shared.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param() params: objectIdDto) {
    const category = await this.categoriesService.findOne(params.id);
    const products = await this.productsService.findProductsByCaregory(
      params.id,
    );
    return { ...category.toObject(), products: products };
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param() params: objectIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(params.id, updateCategoryDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param() params: objectIdDto) {
    return this.categoriesService.remove(params.id);
  }
}
