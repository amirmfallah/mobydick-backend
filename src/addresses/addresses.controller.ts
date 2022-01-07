import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('api/v1/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Request() req: any,
  ) {
    createAddressDto.ownerId = req.user?.userId;
    return this.addressesService.create(createAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    return this.addressesService.findAll(req.user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.addressesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.addressesService.remove(id);
  }
}
