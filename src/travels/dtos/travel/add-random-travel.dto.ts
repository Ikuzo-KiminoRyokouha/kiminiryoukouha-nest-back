import { IsNumber, IsString } from 'class-validator';
import { BasicOutput } from '../../../common/dtos/output.dto';
import { Travel } from '../../../travels/entities/travel.entity';

export class AddRandomTravelInput {
  @IsNumber()
  planId: number;

  @IsString()
  tag: string[];
}

export class AddRandomTravelOutput extends BasicOutput {
  travel?: Travel;
}
