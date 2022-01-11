import { IsNotEmpty, IsNumberString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(11, 11)
  @IsNumberString()
  readonly phone: string;

  @IsNotEmpty()
  @Length(5, 5)
  @IsNumberString()
  readonly code: string;
}

export class CreateUserPassDto {
  @IsNotEmpty()
  @Length(11, 11)
  @IsNumberString()
  readonly phone: string;

  @MinLength(5)
  @IsNotEmpty()
  readonly username: string;

  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;
}

export class LoginUserPassDto {
  @MinLength(5)
  @IsNotEmpty()
  readonly username: string;

  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;
}
