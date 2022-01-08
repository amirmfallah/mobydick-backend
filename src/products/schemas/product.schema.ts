import {
  Ingredients,
  IngredientsSchema,
} from './../../ingredients/schemas/ingredients.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { IngredientItem } from 'src/cart/interfaces/cart.interface';
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
    type: [
      {
        available: { type: Boolean },
        optionName: { type: String },
        price: { type: Number },
      },
    ],
  })
  price: {
    available: boolean;
    optionName: string;
    price: number;
  }[];

  @Prop({
    type: Number,
  })
  discount: number;

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
        required: { type: Boolean },
        included: { type: Boolean },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Ingredients.name,
        },
        forOption: { type: Number },
        _id: false,
      },
    ],
  })
  bread: IngredientItem[];

  @Prop({
    type: [
      {
        required: { type: Boolean },
        included: { type: Boolean },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Ingredients.name,
        },
        forOption: { type: Number },
        _id: false,
      },
    ],
  })
  ingredients: IngredientItem[];

  @Prop({
    type: [
      {
        required: { type: Boolean },
        included: { type: Boolean },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Ingredients.name,
        },
        forOption: { type: Number },
        _id: false,
      },
    ],
  })
  optional: IngredientItem[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
