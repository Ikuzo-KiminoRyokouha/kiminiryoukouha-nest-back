import { BasicOutput } from 'src/common/dtos/output.dto';

export class ShowMyAccountInfoOutput extends BasicOutput {
  info?: { bank_name: string; account_num: string };
}
