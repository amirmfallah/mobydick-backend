import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('refreshSecret'),
      passReqToCallback: true,
    });
  }
  async validate(req, payload: any) {
    const token = req.body.refreshToken;
    const user = await this.userService.checkRefreshToken(
      payload.userId,
      token,
    );
    if (user == null) {
      throw new UnauthorizedException();
    }
    return { userId: payload.userId, phone: payload.phone };
  }
}
