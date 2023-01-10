import { BasicOutput } from 'src/common/dtos/output.dto';
import { Plan } from 'src/travels/entities/plan.entity';

export class ShowPlansOutput extends BasicOutput {
  plans?: Plan[];
  pages?: number;
}
