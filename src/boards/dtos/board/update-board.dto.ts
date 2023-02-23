import { PartialType } from '@nestjs/mapped-types';
import { BasicOutput } from '../../../common/dtos/output.dto';
import { CreateBoardInput } from './create-board.dto';

export class UpdateBoardInput extends PartialType(CreateBoardInput) {}

export class UpdateBoardOutput extends BasicOutput {}
