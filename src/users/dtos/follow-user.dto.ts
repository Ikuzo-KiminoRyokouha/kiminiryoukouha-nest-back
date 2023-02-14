import { IsNumber } from 'class-validator';
import { BasicOutput } from '../../common/dtos/output.dto';

export class FollowUserInput {
  @IsNumber()
  targetId: number;
}

export class FollowUserOutput extends BasicOutput {}
