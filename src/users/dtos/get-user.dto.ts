import { IsNumber, IsString } from 'class-validator';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class GetUserInput {
  @IsString()
  userId: number;
}

export class GetUserOutput extends BasicOutput {}
