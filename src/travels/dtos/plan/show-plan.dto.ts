import { BasicOutput } from '../../../common/dtos/output.dto';
import { Plan } from '../../../travels/entities/plan.entity';

export class ShowPlanOutput extends BasicOutput {
  plan?: Plan;
}
