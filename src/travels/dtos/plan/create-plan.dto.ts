import { PickType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { Plan } from 'src/travels/entities/plan.entity';

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
