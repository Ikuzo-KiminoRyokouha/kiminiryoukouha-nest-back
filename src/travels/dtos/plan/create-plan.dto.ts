import { PickType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
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
  'users',
]) {}

export class CreatePlanOutput extends BasicOutput {}
