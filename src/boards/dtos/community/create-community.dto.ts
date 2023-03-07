import { PickType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { Community } from '../../../boards/entities';
import { BasicOutput } from '../../../common/dtos/output.dto';

export class CreateCommunityInput extends PickType(Community, [
  'img',
  'content',
]) {
  @IsOptional()
  @IsNumber()
  planId: number;
}

export class CreateCommunityOutput extends BasicOutput {}
