import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';
import { Gift, GiftSchema } from './schemas/gifts.schema';

@Module({
  controllers: [GiftsController],
  providers: [GiftsService],
  imports: [
    MongooseModule.forFeature([{ name: Gift.name, schema: GiftSchema }]),
  ],
})
export class GiftsModule {}
