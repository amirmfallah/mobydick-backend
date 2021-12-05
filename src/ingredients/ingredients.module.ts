import { Ingredients, IngredientsSchema } from './schemas/ingredients.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [
    MongooseModule.forFeature([
      { name: Ingredients.name, schema: IngredientsSchema },
    ]),
  ],
})
export class IngredientsModule {}
