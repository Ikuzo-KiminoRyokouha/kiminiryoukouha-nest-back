import { PickType } from '@nestjs/mapped-types';
import { IsDateString, IsNumber } from 'class-validator';

export class CreateCopyPlanInput {
  @IsNumber()
  'planId': number;

  @IsDateString()
  'start': string;
}
