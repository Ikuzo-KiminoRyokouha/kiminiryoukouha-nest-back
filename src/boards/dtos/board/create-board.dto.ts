import { PickType } from '@nestjs/mapped-types';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { Board } from '../../entities/board.entity';

export class CreateBoardInput extends PickType(Board, [
  'title',
  'content',
  'secret',
]) {}

export class CreateBoardOutput extends BasicOutput {}
