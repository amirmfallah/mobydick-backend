import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { Gift } from './schemas/gifts.schema';
import { Model } from 'mongoose';

@Injectable()
export class GiftsService {
  constructor(@InjectModel(Gift.name) private giftModel: Model<Gift>) {}
  create(createGiftDto: CreateGiftDto) {
    return new this.giftModel(createGiftDto).save();
  }

  findAll() {
    return this.giftModel.find({});
  }

  findOneByCode(code: string) {
    return this.giftModel.findOne({ code: code });
  }

  findOne(id: string) {
    return this.giftModel.findById(id);
  }

  update(id: string, updateGiftDto: UpdateGiftDto) {
    return this.giftModel.findByIdAndUpdate(id, updateGiftDto);
  }

  remove(id: string) {
    return this.giftModel.findByIdAndRemove(id);
  }
}
