import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

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
