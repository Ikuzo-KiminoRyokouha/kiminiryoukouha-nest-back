import { IsString } from 'class-validator';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { Account } from 'src/travels/entities/account.entity';

export class ShowTransactionInput {
  @IsString()
  planId: string;
}

export class ShowTransactionOut extends BasicOutput {
  transaction?: Account[];
}
