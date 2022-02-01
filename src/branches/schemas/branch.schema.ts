import { Product } from './../../products/schemas/product.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { Address } from 'src/addresses/schemas/address.schema';
import { AddressDto } from 'src/shared/dto/shared.dto';

@Schema({ timestamps: true })
export class Branch extends Document {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    unique: true,
  })
  ownerId: string;

  @Prop({
    type: String,
  })
  thumbnail: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  status: boolean;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product.name,
      },
    ],
    default: [],
  })
  favoriteProducts: string[];

  @Prop({
    type: Array,
    default: [],
  })
  sliderPictures: string[];

  @Prop({
    type: Boolean,
    default: false,
  })
  verified: boolean;

  @Prop({
    type: {
      address: String,
      lat: Number,
      lng: Number,
      phone: String,
      description: String,
      open: Boolean,
    },
  })
  address: AddressDto;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
