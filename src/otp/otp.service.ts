import { RedisService } from './../shared/services/redis.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

interface getToken {
  UserApiKey: string;
  SecretKey: string;
}
interface tokenResponse {
  TokenKey: string;
  IsSuccessful: boolean;
  Message: string;
}
interface getVerification {
  Code: string;
  MobileNumber: string;
}
interface verificationResponse {
  VerificationCodeId: number;
  IsSuccessful: boolean;
  Message: string;
}
@Injectable()
export class OtpService {
  apiKey: string;
  secretKey: string;
  secureKey: string;
  baseUrl: string;

  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.apiKey = configService.get('SMS_API_KEY');
    this.secretKey = configService.get('SMS_SECRET_KEY');
    this.baseUrl = configService.get('SMS_API_URL');
  }
  async sendOtp(number: string): Promise<any> {
    const code = String(Math.floor(10000 + Math.random() * 90000));
    //const code = 12345;
    await this.getToken();
    await this.sendVerificationCode(code, number);
    return this.redisService.set(number, code, 120);
  }

  async validateOtp(phone: string, code: string) {
    const result = await this.redisService.get(phone);
    this.redisService.delete(phone);
    if (result && result == code) {
      return true;
    } else {
      return false;
    }
  }

  async getToken() {
    const httpReq = <getToken>{
      UserApiKey: this.apiKey,
      SecretKey: this.secretKey,
    };
    const res = this.httpService.post(`${this.baseUrl}/Token`, httpReq);
    const body: tokenResponse = (await lastValueFrom(res)).data;
    if (!body.IsSuccessful) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    this.secureKey = body.TokenKey;
  }

  async sendVerificationCode(code, phone) {
    await this.getToken();
    const httpReq: getVerification = {
      Code: code,
      MobileNumber: phone,
    };

    const res = this.httpService.post(
      `${this.baseUrl}/VerificationCode`,
      httpReq,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-sms-ir-secure-token': this.secureKey,
        },
      },
    );

    const body: verificationResponse = (await lastValueFrom(res)).data;
    if (!body.IsSuccessful) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
