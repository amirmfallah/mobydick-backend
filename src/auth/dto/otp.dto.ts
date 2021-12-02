import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class OtpDto {
  @IsNotEmpty()
  @Length(11, 11)
  @IsNumberString()
  readonly phone: string;
}
