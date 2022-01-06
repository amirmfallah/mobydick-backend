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
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('api/v1/carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Request() req) {
    createCartDto.ownerId = req.user.userId;
    return await this.cartService.create(createCartDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('open')
  async getOpenCart(@Request() req) {
    const cart = await this.cartService.findOneOpenCart(req.user.userId);
    if (!cart) {
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
