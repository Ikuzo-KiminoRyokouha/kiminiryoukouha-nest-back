import { PickType } from '@nestjs/mapped-types';
import { Comment } from '../../../boards/entities/comment.entity';
import { BasicOutput } from '../../../common/dtos/output.dto';

export class CreateCommentInput extends PickType(Comment, [
  'boardId',
  'group',
  'targetId',
  'content',
]) {}

export class CreateCommentOutput extends BasicOutput {}
