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
import {
  CreateUserDto,
  CreateUserPassDto,
  LoginUserPassDto,
} from './dto/create-user.dto';
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

  @Post('password/signup')
  @HttpCode(HttpStatus.CREATED)
  async createUserUserPass(@Body() createUser: CreateUserPassDto) {
    return await this.userService.CreateUserPass(createUser);
  }

  @Post('password/login')
  async loginUserPass(@Body() loginUser: LoginUserPassDto) {
    let user;
    try {
      user = await this.userService.userPassValidate(loginUser);
    } catch (err) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return { roles: user.roles, ...(await this.authService.login(user)) };
  }

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

  @UseGuards(JwtAuthGuard)
  @Get('test')
  getHello(@Request() req): string {
    return req.user;
  }
}
