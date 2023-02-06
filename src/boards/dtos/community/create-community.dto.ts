import { PickType } from '@nestjs/mapped-types';
import { Community } from 'src/boards/entities';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class CreateCommunityInput extends PickType(Community, [
  'planId',
  'img',
  'content',
]) {}

export class CreateCommunityOutput extends BasicOutput {}
