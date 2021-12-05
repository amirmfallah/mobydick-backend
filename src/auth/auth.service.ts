import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { User } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private otpService: OtpService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(phone: string, code: string): Promise<User> {
    const otpValidation = await this.otpService.validateOtp(phone, code);
    if (!otpValidation) {
      return null;
    }
    return await this.userService.UserExistsByPhone(phone);
  }

  async login(user: User) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    await this.userService.UserLastLoginUpdate(user._id, refreshToken);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      token_type: 'bearer',
      expires_in: this.configService.get('jwtExpiration'),
    };
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = { phone: user.phone, userId: user._id, roles: user.roles };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwtSecret'),
      expiresIn: this.configService.get('jwtExpiration'),
    });
    return token;
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = { phone: user.phone, userId: user._id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('refreshSecret'),
      expiresIn: this.configService.get('refreshExpiration'),
    });
    return token;
  }
}
