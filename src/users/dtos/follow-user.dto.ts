import { IsNumber } from 'class-validator';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class FollowUserInput {
  @IsNumber()
  sourceId: number;
  @IsNumber()
  targetId: number;
}

export class FollowUserOutput extends BasicOutput {}
