import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { BankingToken } from 'src/travels/entities/bankingToken.entity';

export class SaveCountInput {
  @IsString()
  'bank_name': string;

  @IsString()
  'account_num_masked': string;

  @IsString()
  'account_holder_name': string;
}
