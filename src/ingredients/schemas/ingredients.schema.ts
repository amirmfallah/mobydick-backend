import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Ingredients extends Document {
  @Prop({
    required: true,
    type: String,
  })
  name: string;
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
}

export const IngredientsSchema = SchemaFactory.createForClass(Ingredients);
