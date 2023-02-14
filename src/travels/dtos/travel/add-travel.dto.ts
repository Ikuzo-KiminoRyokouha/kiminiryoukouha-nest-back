import { BasicOutput } from 'src/common/dtos/output.dto';
import { Travel } from 'src/travels/entities/travel.entity';

export class AddTraveOutPut extends BasicOutput {
  travel?: Travel;
}
