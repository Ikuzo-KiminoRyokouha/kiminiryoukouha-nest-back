import { PickType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Destination } from 'src/travels/entities/destination.entity';
import { BasicOutput } from '../../../common/dtos/output.dto';
import { Plan } from '../../../travels/entities/plan.entity';

export class CreatePlanInput extends PickType(Plan, [
  'title',
  'tag',
  'start',
  'end',
  'city',
  'destination',
  'totalCost',
  'dayPerCost',
]) {}

export class CreatePlanOutput extends BasicOutput {}
