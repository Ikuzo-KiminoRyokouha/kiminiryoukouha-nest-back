import { IsArray, IsNumber } from 'class-validator';
import { BasicOutput } from '../../../common/dtos/output.dto';

export class ShowTravelBySurpriseInput {
  @IsNumber()
  userId: number;

  @IsNumber()
  count: number;

  @IsArray()
  tag: string[];

  @IsNumber()
  planId: number;
}

export class ShowTravelBySurpriseOutput extends BasicOutput {
  destination?: any;
}
