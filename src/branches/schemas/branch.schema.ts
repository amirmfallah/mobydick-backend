import { Product } from './../../products/schemas/product.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/users.schema';

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
  })
  favoriteProducts: string[];

  @Prop({
    type: Array,
  })
  sliderPictures: string[];
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
