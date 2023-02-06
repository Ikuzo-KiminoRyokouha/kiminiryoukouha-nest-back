import { PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { Community } from 'src/boards/entities';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class UpdateCommunityInput extends PickType(Community, [
  'planId',
  'img',
  'content',
]) {
  @IsNumber()
  id: number;
}

export class UpdateCommunityOutput extends BasicOutput {}
