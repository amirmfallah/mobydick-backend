import {
  CartDto,
  CartItemPopulated,
  CartPopulated,
} from './interfaces/cart.interface';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/shared/roles.enum';
import { Roles } from 'src/shared/roles.decorator';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Pagination } from 'src/shared/dto/shared.dto';
import { calculateProductPrice } from './functions.helper';

@Controller('api/v1/carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Request() req) {
    createCartDto.ownerId = req.user.userId;
    const cart = await this.cartService.create(createCartDto);
    return calculateProductPrice(cart);
  }

  @UseGuards(JwtAuthGuard)
  @Get('open')
  async getOpenCart(@Request() req) {
    const cart = await this.cartService.findOneOpenCart(req.user.userId);
    if (!cart) {
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }

    return calculateProductPrice(cart);
  }

  @Roles(Role.Super)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() pagination: Pagination) {
    return this.cartService.findAll(pagination);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('branch/:id')
  findAllByBranch(@Param('id') id: string, @Query() pagination: Pagination) {
    return this.cartService.findAllByBranch(id, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    const cart = await this.cartService.update(id, updateCartDto);
    return calculateProductPrice(cart);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
