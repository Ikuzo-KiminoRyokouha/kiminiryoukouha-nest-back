import { Board } from 'src/boards/entities/board.entity';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class ShowBoardOutput extends BasicOutput {
  board?: Board;
}
