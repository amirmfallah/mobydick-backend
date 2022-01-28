import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {}

export class VerifiedDto {
  @Allow()
  verified: string;
}

export class SuperUpdateBranchDto extends IntersectionType(
  PartialType(CreateBranchDto),
  PartialType(VerifiedDto),
) {}
