import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './schemas/address.schema';
import { Model } from 'mongoose';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}
  create(createAddressDto: CreateAddressDto) {
    return new this.addressModel(createAddressDto).save();
  }

  findAll(ownerId: string) {
    return this.addressModel.find({ ownerId: ownerId }).exec();
  }

  findOne(id: string) {
    return this.addressModel.findById(id);
  }

  update(id: string, updateAddressDto: UpdateAddressDto) {
    return this.addressModel.findByIdAndUpdate(id, updateAddressDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.addressModel.findByIdAndRemove(id);
  }
}
