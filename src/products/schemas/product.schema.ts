import {
  Ingredients,
  IngredientsSchema,
} from './../../ingredients/schemas/ingredients.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
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
    type: mongoose.Schema.Types.ObjectId,
  })
  category: string;

  @Prop({
    type: [
      {
        available: { type: Boolean },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Ingredients.name,
        },
        _id: false,
      },
    ],
  })
  bread: { available: boolean; item: string }[];

  @Prop({
    type: [
      {
        available: { type: Boolean },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Ingredients.name,
        },
        _id: false,
      },
    ],
  })
  ingredients: { available: boolean; item: string }[];

  @Prop({
    type: [
      {
        available: { type: Boolean },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Ingredients.name,
        },
        _id: false,
      },
    ],
  })
  optional: { available: boolean; item: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
