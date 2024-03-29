import { ReportParamDto, ReportDto } from './../shared/dto/shared.dto';
import { Cart } from 'src/cart/schemas/cart.schema';
import { CartService } from './../cart/cart.service';
import { CartStatus } from './../cart/interfaces/cart.enum';
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
  Res,
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
import * as _ from 'lodash';
import persianDate = require('persian-date');
@Controller('api/v1/orders')
export class OrdersController {
  gateway: AbstractPayment;
  callbackUrl;
  hostUrl;

  constructor(
    private readonly ordersService: OrdersService,
    private nestpayGateway: NextPayGateway,
    private configService: ConfigService,
    private cartService: CartService,
  ) {
    this.gateway = nestpayGateway;
    this.callbackUrl =
      this.configService.get('API_HOST') + '/api/v1/orders/callback';
    this.hostUrl = this.configService.get('HOST') + '/history';
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
  @Get('checkout/:id')
  async checkout(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    await this.cartService.update((<Cart>order.cartId)._id, { open: false });

    const paymentInfo = await this.gateway.getPayment({
      orderId: order._id,
      amount: order.total - order.totalDiscount,
      callbackUrl: this.callbackUrl,
    });
    return { url: this.gateway.getGatewayUrl(paymentInfo.data) };
    //return this.ordersService.findAll(pagination);
  }

  @Get('callback')
  async verifyTransaction(@Query() verifyQuery, @Res() res) {
    const result = (await this.gateway.verifyPayment(verifyQuery)).data;
    let status = CartStatus.OPEN;

    if (result.data === 0) {
      status = CartStatus.REGISTERED;
    } else {
      status = CartStatus.CANCELED;
    }
    await this.ordersService.update(result.order_id, {
      payment: result,
      status: status,
      trans_id: verifyQuery.trans_id,
    });

    console.log(result);
    return res.redirect(this.hostUrl);
  }

  @Roles(Role.Super)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() pagination: Pagination, @Query('search') search: string) {
    return this.ordersService.findAll(pagination, search);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user')
  findAllByUser(@Request() req) {
    const userId = req.user.userId;
    return this.ordersService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('branch/:id')
  findAllByBranch(
    @Query() pagination: Pagination,
    @Param('id') id: string,
    @Query('search') search: string,
  ) {
    return this.ordersService.findAllByBranch(id, pagination, search);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('branch/:id/report')
  async reportByBranch(
    @Param('id') id: string,
    @Query() query: ReportParamDto,
  ) {
    if (!query.to) {
      query.to = new Date();
    }
    if (!query.from) {
      const date = new persianDate();
      query.from = new persianDate([date.year(), date.month(), 1]);
    }
    const orders = await this.ordersService.reportByBranch(id, query);
    const report: ReportDto = {
      totalCount: orders.length,
      totalOpen: orders.filter((order) => order.status === CartStatus.OPEN)
        .length,
      totalSold: _.sumBy(orders, (order) => {
        if (
          order.status !== CartStatus.CANCELED &&
          order.status !== CartStatus.OPEN
        ) {
          return _.get(order.payment, 'amount') || 0;
        } else {
          return 0;
        }
      }),
    };
    return report;
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
}
