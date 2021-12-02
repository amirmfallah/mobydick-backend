import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    type: String,
    index: {
      unique: true,
    },
  })
  phone: string;

  @Prop({
    type: String,
  })
  thumbnail: string;

  @Prop({
    type: String,
  })
  biography: string;

  @Prop({
    type: String,
  })
  role: string;

  @Prop({
    type: Date,
  })
  lastLogin: Date;

  @Exclude()
  @Prop({
    type: String,
  })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
