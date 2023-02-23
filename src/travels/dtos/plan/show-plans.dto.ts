import { BasicOutput } from '../../../common/dtos/output.dto';
import { Plan } from '../../../travels/entities/plan.entity';

export class ShowPlansOutput extends BasicOutput {
  plans?: Plan[];
  pages?: number;
}
