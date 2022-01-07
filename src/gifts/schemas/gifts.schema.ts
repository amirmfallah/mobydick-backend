import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Gift extends Document {
  @Prop({
    type: Date,
    required: true
  })
  validUntil: Date;

  @Prop({
    type: Number
  })
  amount: number;

  @Prop({
    type: Number
  })
  percent: number;

  @Prop({
    type: String,
    required: true
  })
  code: string;
}

export const GiftSchema = SchemaFactory.createForClass(Gift);
