import { PartialType } from '@nestjs/mapped-types';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { CreateCommentInput } from './create-comment.dto';

export class UpdateCommentInput extends PartialType(CreateCommentInput) {}

export class updateCommentOutput extends BasicOutput {}
