import { BasicOutput } from 'src/common/dtos/output.dto';
import { Plan } from 'src/travels/entities/plan.entity';

export class ShowPlanOutput extends BasicOutput {
  plan?: Plan;
}
