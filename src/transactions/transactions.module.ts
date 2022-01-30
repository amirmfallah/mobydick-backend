import { ServicesModule } from './../shared/services/services.module';
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [ServicesModule],
})
export class TransactionsModule {}
