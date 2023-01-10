import { Comment } from 'src/boards/entities/comment.entity';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class ShowCommentsOutput extends BasicOutput {
  comments?: Comment[];
  count?: number;
}
