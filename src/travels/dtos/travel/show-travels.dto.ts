import { BasicOutput } from 'src/common/dtos/output.dto';
import { Travel } from 'src/travels/entities/travel.entity';

export class showTravelsOutput extends BasicOutput {
  travels?: Travel[];
}
