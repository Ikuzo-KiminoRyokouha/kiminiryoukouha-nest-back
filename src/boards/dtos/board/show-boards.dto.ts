import { Board } from 'src/boards/entities/board.entity';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class ShowBoardsOutput extends BasicOutput {
  boards?: Board[];
  pages?: number;
}
