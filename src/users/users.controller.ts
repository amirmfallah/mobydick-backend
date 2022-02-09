import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

@Controller('api/v1/users')
export class UsersController {
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
  //   const userId = req.user.userId;
  //   createOrderDto.ownerId = userId;
  //   return this.ordersService.create(createOrderDto);
  // }
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserDetail(@Request() req) {
    const userId = req.user.userId;
    return this.usersService.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patchUser(@Request() req, @Body() body: UpdateUserDto) {
    const userId = req.user.userId;
    return this.usersService.patchUser(userId, body);
  }
}
