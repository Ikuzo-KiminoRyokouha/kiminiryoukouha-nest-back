import { PickType } from '@nestjs/mapped-types';
import { CommComments } from 'src/boards/entities';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class CreateCommCommentInput extends PickType(CommComments, [
  'postId',
  'depth',
  'content',
  'targetId',
  'order',
]) {}

export class CreateCommCommentOutput extends BasicOutput {}
