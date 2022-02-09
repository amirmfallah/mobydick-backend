import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  CreateUserPassDto,
  LoginUserPassDto,
} from 'src/auth/dto/create-user.dto';
import { Role } from 'src/shared/roles.enum';
import { User } from './schemas/users.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  saltRound: number;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {
    this.saltRound = 10;
  }

  async CreateUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    user.roles = [Role.User];
    return user.save();
  }

  async searchUserByPhone(phone: string) {
    const exp = new RegExp(phone);
    return this.userModel.findOne({ phone: exp });
  }

  async CreateUserPass(createUserDto: CreateUserPassDto): Promise<User> {
    const hash = await bcrypt.hash(createUserDto.password, this.saltRound);
    const userHashed = <CreateUserPassDto>{
      username: createUserDto.username,
      password: hash,
      phone: createUserDto.phone,
    };
    const user = new this.userModel(userHashed);
    user.roles = [Role.User, Role.Admin];
    return user.save();
  }

  async userPassValidate(userDto: LoginUserPassDto): Promise<User> {
    const user = await this.userModel.findOne({
      username: userDto.username,
    });

    if (!user) {
      throw new Error('NOT_FOUND');
    }

    const isMatch = await bcrypt.compare(userDto.password, user.password);
    if (!isMatch) {
      throw new Error('WRONG_PASS');
    }

    return user;
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

  async patchUser(userId: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password || updateUserDto.lastPassword) {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new Error('NOT_FOUND');
      }

      const isMatch = await bcrypt.compare(
        updateUserDto.lastPassword,
        user.password,
      );
      if (!isMatch) {
        throw new Error('WRONG_PASS');
      }

      delete updateUserDto.lastPassword;
      const hash = await bcrypt.hash(updateUserDto.password, this.saltRound);
      updateUserDto.password = hash;
    }
    return await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
  }
}
