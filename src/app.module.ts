import { ServicesModule } from './shared/services/services.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { OtpModule } from 'src/otp/otp.module';
import { UsersModule } from 'src/users/users.module';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { CategoriesModule } from './categories/categories.module';
import { BranchesModule } from './branches/branches.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    OtpModule,
    ProductsModule,
    IngredientsModule,
    CategoriesModule,
    BranchesModule,
    CartModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
