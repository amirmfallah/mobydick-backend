import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Otp extends Document {
  @Prop({
    required: true,
    type: String,
  })
  phone: string;

  @Prop({
    required: true,
    type: String,
  })
  code: string;

  @Prop({
    index: {
      unique: true,
      expires: '120s',
    },
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    required: true,
    type: Date,
  })
  expiresAt: Date;

  @Prop({
    type: Number,
  })
  expiration: number;
  action: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
