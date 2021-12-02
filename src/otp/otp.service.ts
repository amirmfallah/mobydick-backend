import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { Otp } from './schemas/otp.schema';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private userService: UsersService,
  ) {}
  async sendOtp(number: string): Promise<Otp> {
    //const code = String(Math.floor(10000 + Math.random() * 90000));
    const code = 12345;
    const newOtp = new this.otpModel({
      phone: number,
      code: code,
      expiration: 120,
      expiresAt: new Date(Date.now() + 120000),
    });
    return newOtp.save();
  }

  async validateOtp(phone: string, code: string) {
    const otp = await this.otpModel.findOne({
      phone: phone,
      code: code,
    });
    if (otp == null) {
      return false;
    } else {
      otp.delete();
      return otp;
    }
  }
}
