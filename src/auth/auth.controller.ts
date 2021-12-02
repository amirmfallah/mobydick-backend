import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OtpService } from 'src/otp/otp.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { OtpDto } from './dto/otp.dto';
import { JwtRefreshGuard } from './jwt-refresh.guard';

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
    const otp = await this.otpService.sendOtp(otpDto.phone);
    const user = await this.userService.UserExistsByPhone(otpDto.phone);
    const doc = otp.toJSON();
    delete doc.code;
    if (user) {
      doc.action = 'SIGNIN';
    } else {
      doc.action = 'SIGNUP';
    }
    return doc;
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    let user = await this.userService.UserExistsByPhone(createUserDto.phone);
    if (user != null) {
      throw new HttpException(
        'Phone number is duplicated.',
        HttpStatus.CONFLICT,
      );
    }
    const otp = await this.otpService.validateOtp(
      createUserDto.phone,
      createUserDto.code,
    );
    if (otp == false) {
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }
    user = await this.userService.CreateUser(createUserDto);
    return this.authService.login(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.validateUser(
      createUserDto.phone,
      createUserDto.code,
    );
    if (!user) {
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }
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
}
