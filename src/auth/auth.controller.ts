import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from './../shared/roles.enum';
import { Roles } from './../shared/roles.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OtpService } from 'src/otp/otp.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { OtpDto } from './dto/otp.dto';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { isPhoneNumber } from 'class-validator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private otpService: OtpService,
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('otp')
  @HttpCode(HttpStatus.CREATED)
  async sendOtp(@Body() otpDto: OtpDto) {
    await this.otpService.sendOtp(otpDto.phone);
    return {
      phone: otpDto.phone,
      expiration: 120,
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    let user = await this.userService.UserExistsByPhone(createUserDto.phone);
    const otp = await this.otpService.validateOtp(
      createUserDto.phone,
      createUserDto.code,
    );
    if (otp == false) {
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }

    if (user != null) {
      return this.authService.login(user);
    }

    user = await this.userService.CreateUser(createUserDto);
    return this.authService.login(user);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req) {
    const userId = req.user.userId;
    return {
      access_token: await this.authService.generateAccessToken(userId),
    };
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('test')
  getHello(@Request() req): string {
    return req.user;
  }
}
