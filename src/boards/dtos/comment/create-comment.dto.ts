import { PickType } from '@nestjs/mapped-types';
import { Comment } from 'src/boards/entities/comment.entity';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class CreateCommentInput extends PickType(Comment, [
  'boardId',
  'group',
  'targetId',
  'content',
]) {}

export class CreateCommentOutput extends BasicOutput {}
