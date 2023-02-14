import { PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { Community } from '../../../boards/entities';
import { BasicOutput } from '../../../common/dtos/output.dto';

export class UpdateCommunityInput extends PickType(Community, [
  'img',
  'content',
]) {
  @IsNumber()
  id: number;
  @IsNumber()
  planId: number;
}

export class UpdateCommunityOutput extends BasicOutput {}
