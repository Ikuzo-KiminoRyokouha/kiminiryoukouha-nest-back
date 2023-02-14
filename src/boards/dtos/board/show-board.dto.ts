import { Board } from '../../../boards/entities/board.entity';
import { BasicOutput } from '../../../common/dtos/output.dto';

export class ShowBoardOutput extends BasicOutput {
  board?: Board;
}
