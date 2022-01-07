import { JwtAuthGuard } from './../auth/jwt-auth.guard';
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
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { Roles } from 'src/shared/roles.decorator';
import { Role } from 'src/shared/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('api/v1/gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createGiftDto: CreateGiftDto) {
    return await this.giftsService.create(createGiftDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async verify(@Query('code') code: string) {
    if (!code) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const gift = await this.giftsService.findOneByCode(code);
    if (!gift) {
      throw new HttpException('Not Found.', HttpStatus.NOT_FOUND);
    }
    return gift;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.giftsService.findAll();
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.giftsService.findOne(id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGiftDto: UpdateGiftDto) {
    return await this.giftsService.update(id, updateGiftDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.giftsService.remove(id);
  }
}
