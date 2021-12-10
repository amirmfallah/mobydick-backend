import { BranchSchema, Branch } from './schemas/branch.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';

@Module({
  controllers: [BranchesController],
  providers: [BranchesService],
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
    ]),
  ],
})
export class BranchesModule {}
