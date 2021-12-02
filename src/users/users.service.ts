import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async CreateUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId);
  }

  async UserExistsByPhone(number: string): Promise<User> {
    return this.userModel.findOne({ phone: number });
  }

  async UserLastLoginUpdate(userId, refreshToken: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
      refreshToken: refreshToken,
    });
  }

  async checkRefreshToken(userId, refreshToken): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (user.refreshToken == refreshToken) {
      return user;
    }
    return null;
  }
}
