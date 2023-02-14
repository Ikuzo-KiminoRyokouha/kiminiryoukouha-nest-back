import { Board } from '../../../boards/entities/board.entity';
import { BasicOutput } from '../../../common/dtos/output.dto';

export class ShowBoardsOutput extends BasicOutput {
  boards?: Board[];
  pages?: number;
}
