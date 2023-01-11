import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreatePlanInput, CreatePlanOutput } from './create-plan.dto';

export class CreateRandomPlanInput extends OmitType(CreatePlanInput, [
  'destination',
]) {
  @IsNumber()
  dayPerDes: number;
}

export class CreateRandomPlanOutput extends CreatePlanOutput {}
