import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionInput {
  @IsString()
  planId: string;
}
