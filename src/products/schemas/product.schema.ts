import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
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
    type: String,
  })
  thumbnail: string;

  @Prop({
    type: Number,
  })
  price: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  available: boolean;

  @Prop({
    type: Array,
  })
  bread: Array<string>;

  @Prop({
    type: Array,
  })
  ingredients: Array<string>;

  @Prop({
    type: Array,
  })
  optional: Array<string>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
