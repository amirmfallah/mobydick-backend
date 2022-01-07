import { Allow, IsNotEmpty } from 'class-validator';
export class CreateGiftDto {
  @IsNotEmpty()
  validUntil: Date;

  @Allow()
  amount: number;

  @Allow()
  percent: number;

  @IsNotEmpty()
  code: string;
}
