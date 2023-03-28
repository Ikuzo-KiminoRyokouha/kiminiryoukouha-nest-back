import { IsString } from 'class-validator';

export class CreateBankingTokenInput {
  @IsString()
  'authCode': string;
}
