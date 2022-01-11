import { ServicesModule } from './../shared/services/services.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { OtpService } from './otp.service';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    UsersModule,
    ServicesModule,
    HttpModule,
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
