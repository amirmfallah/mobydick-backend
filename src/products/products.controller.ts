import { objectIdDto, Pagination } from './../shared/dto/shared.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Role } from './../shared/roles.enum';
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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/shared/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() pagination: Pagination) {
    return await this.productsService.findAll(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param() params: objectIdDto) {
    return await this.productsService.findOne(params.id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param() params: objectIdDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(params.id, updateProductDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param() params: objectIdDto) {
    return await this.productsService.remove(params.id);
  }
}
