import { BasicOutput } from 'src/common/dtos/output.dto';
import { BankAccount } from 'src/travels/services/banking.service';

export class ShowAccountsOutput extends BasicOutput {
  accounts: BankAccount[];
}
