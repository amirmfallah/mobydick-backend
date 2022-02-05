import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Pagination } from 'src/shared/dto/shared.dto';
import { Roles } from 'src/shared/roles.decorator';
import { Role } from 'src/shared/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AbstractPayment } from 'src/shared/AbstractPayment';
import { NextPayGateway } from 'src/shared/gateways/nextpay.gateway';

@Controller('api/v1/orders')
export class OrdersController {
  gateway: AbstractPayment;
  callbackUrl;
  constructor(
    private readonly ordersService: OrdersService,
    private nestpayGateway: NextPayGateway,
    private configService: ConfigService,
  ) {
    this.gateway = nestpayGateway;
    this.callbackUrl = this.configService.get('HOST');
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const userId = req.user.userId;
    createOrderDto.ownerId = userId;
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('open')
  async findOpen(@Request() req, @Query('cart') cartId: string) {
    const userId = req.user.userId;
    const order = await this.ordersService.findOpenByUser(userId, cartId);
    if (!order) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkout')
  async checkout() {
    const paymentInfo = await this.gateway.getPayment({
      orderId: 'f7c07568-c6d1-4bee-87b1-4a9e5ed2e4c1',
      amount: 123000,
      callbackUrl: this.callbackUrl,
    });
    return this.gateway.getGatewayUrl(paymentInfo.data);
    //return this.ordersService.findAll(pagination);
  }

  @Roles(Role.Super)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() pagination: Pagination) {
    return this.ordersService.findAll(pagination);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findAllByBranch(@Query() pagination: Pagination, @Param('id') id: string) {
    return this.ordersService.findAllByBranch(id, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Roles(Role.Super)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Get('callback')
  verifyTransaction(@Query() verifyQuery) {
    return '';
  }
}
