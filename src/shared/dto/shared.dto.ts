import { Allow, IsMongoId } from 'class-validator';

export class objectIdDto {
  @IsMongoId()
  readonly id: string;
}

export class Pagination {
  @Allow()
  page: number;

  @Allow()
  limit: number;
}
