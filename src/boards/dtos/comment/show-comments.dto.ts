import { Comment } from '../../../boards/entities/comment.entity';
import { BasicOutput } from '../../../common/dtos/output.dto';

export class ShowCommentsOutput extends BasicOutput {
  comments?: Comment[];
  count?: number;
}
