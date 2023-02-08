import { IsNumber } from 'class-validator';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class GetUserInput {
  @IsNumber()
  userId: number;
}

export class GetUserOutput extends BasicOutput {}
