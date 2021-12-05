import { IsMongoId } from 'class-validator';

export class objectIdDto {
  @IsMongoId()
  readonly id: string;
}
