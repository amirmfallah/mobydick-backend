import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/users.schema';

@Schema({ timestamps: true })
export class Address extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  ownerId: string;

  @Prop({
    type: Number,
  })
  lat: number;

  @Prop({
    type: Number,
  })
  lng: number;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: String,
  })
  phone: string;

  @Prop({
    type: String,
  })
  description: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
