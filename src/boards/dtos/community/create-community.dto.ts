import { PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { Community } from 'src/boards/entities';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class CreateCommunityInput extends PickType(Community, [
  'img',
  'content',
]) {
  @IsNumber()
  planId: number;
}

export class CreateCommunityOutput extends BasicOutput {}
