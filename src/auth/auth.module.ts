import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpModule } from 'src/otp/otp.module';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategies/refresh.strategy';

@Module({
  providers: [
    JwtAuthGuard,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    RolesGuard,
    AuthService,
  ],
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
      }),
      inject: [ConfigService],
    }),
    OtpModule,
    UsersModule,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
