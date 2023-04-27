import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { throwError } from 'rxjs';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { getBankingCheckCode } from 'src/util/banking/getBankingCheckCode';
import { AccountRepository } from '../repositories/account.respository';
import { BankingRepository } from '../repositories/banking.respository';
import { planRepository } from '../repositories/plan.repository';
import { throws } from 'assert';

export interface BankAccount {
  bank_name: string;
  account_num_masked: string;
  account_holder_name: string;
}

export interface IGetTransaction {
  tran_date: string;
  tran_time: string;
  inout_type: string;
  tran_type: string;
  print_content: string;
  tran_amt: string;
  after_balance_amt: string;
  branch_name: string;
}

@Injectable()
export class BankingService {
  constructor(
    private bankingRepository: BankingRepository,
    private planRepository: planRepository,
    private accountRepository: AccountRepository,
  ) {}

  async createBankingToken({ authCode }, userId) {
    const token = await axios
      .post(
        process.env.BANKING_API_URI + '/oauth/2.0/token',
        {
          code: authCode,
          client_id: process.env.BANKING_CLIENT_ID,
          client_secret: process.env.BANKING_CLIENT_SECRET,
          redirect_uri: process.env.BANKING_REDIRECT_URL,
          grant_type: 'authorization_code',
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      )
      .then((res) => {
        return res.data;
      });
    if (token.rsp_code) {
      return {
        ok: false,
        message: 'error to make banking access token',
      };
    }
    await this.bankingRepository.createBankingAccessToken(
      token.access_token,
      token.refresh_token,
      token.user_seq_no,
      userId,
    );
    return {
      ok: true,
      message: 'success to make banking access token',
    };
  }

  async getMyBankingInfo(userId) {
    const token = await this.bankingRepository.getBankingToken(userId);
    const myInfo = await axios
      .get(
        process.env.BANKING_API_URI +
          '/v2.0/user/me?user_seq_no=' +
          token.userNo,
        {
          headers: { Authorization: 'Bearer' + token.accessToken },
        },
      )
      .then((res) => {
        return res.data;
      });
    console.log(myInfo);
    const bankAccounts: BankAccount[] = myInfo.res_list.map((account) => ({
      bank_name: account.bank_name,
      account_num_masked: account.account_num_masked,
      account_holder_name: account.account_holder_name,
    }));
    return { ok: true, accounts: bankAccounts };
  }

  async getMyBankingBasicInfo(userId) {
    try {
      const info = await this.bankingRepository.getBankingBasicInfo(userId);
      if (!info) {
        return {
          ok: false,
          message: 'cannot find any banking inof',
        };
      }
      return {
        ok: true,
        info,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'failed to find bankgin info',
      };
    }
  }

  async saveMyCount(
    { bank_name, account_num_masked, account_holder_name },
    userId,
  ) {
    const token = await this.bankingRepository.getBankingToken(userId);
    const myInfo = await axios
      .get(
        process.env.BANKING_API_URI +
          '/v2.0/user/me?user_seq_no=' +
          token.userNo,
        {
          headers: { Authorization: 'Bearer' + token.accessToken },
        },
      )
      .then((res) => {
        return res.data;
      });
    const account = myInfo.res_list.find(
      (account) =>
        account.bank_name == bank_name &&
        account.account_num_masked == account_num_masked,
    );
    const savedFinNum = await this.bankingRepository.saveMyAccountInfo(
      token.userNo,
      account.fintech_use_num,
      bank_name,
      account_num_masked,
    );
    if (!savedFinNum)
      return { ok: false, message: 'failed to set your account' };

    return { ok: true, message: 'success to set your account' };
  }

  async createTransactionList({ planId }, userId): Promise<BasicOutput> {
    //계좌조회 데이터 + 새로운 데이터 추가
    console.log('banking service / createTransaction list');
    const token = await this.bankingRepository.getBankingToken(userId);
    const newToken = await this.bankingRepository.updateCheckNum(token);
    const plan = await this.planRepository.showPlan(planId);
    const endDay = plan.end.toISOString().slice(0, 10).split('-').join('');
    const startDay = plan.start.toISOString().slice(0, 10).split('-').join('');
    const checkCode = getBankingCheckCode(newToken.checking);
    const res = await axios
      .get(
        process.env.BANKING_API_URI + '/v2.0/account/transaction_list/fin_num',
        {
          params: {
            bank_tran_id: process.env.BANKING_TRAIN_NUM + 'U' + checkCode,
            fintech_use_num: token.finNum,
            inquiry_type: 'A',
            inquiry_base: 'D',
            from_date: startDay,
            to_date: endDay,
            sort_order: 'D',
            tran_dtime: '20230411010106',
          },
          headers: { Authorization: 'Bearer' + token.accessToken },
        },
      )
      .then((res) => {
        return res.data;
      });
    console.log(res);
    const accountDatas: IGetTransaction[] = res.res_list;

    if (!accountDatas)
      return { ok: false, error: 'failed to read transaction list' };

    const planAccount: IGetTransaction[] = [];
    const storedAccountInfo =
      await this.accountRepository.getAccountInfoByPlanId(planId);

    accountDatas.forEach(async (data) => {
      //계획 날짜의 데이터 만
      if (data.tran_date >= startDay && data.tran_date <= endDay) {
        let flag = true;
        //데이터 중복 제거
        storedAccountInfo.forEach((storedData) => {
          if (
            storedData.date == data.tran_date &&
            storedData.time == data.tran_time &&
            storedData.name == data.branch_name
          ) {
            flag = false;
          }
        });
        if (flag) {
          planAccount.push(data);
        }
        flag = true;
      }
    });

    planAccount.forEach(async (data) => {
      await this.accountRepository.createAccountInfo(
        data.tran_date,
        data.tran_time,
        data.inout_type,
        data.tran_amt,
        data.branch_name,
        planId,
      );
    });

    return { ok: true, message: 'success to  make transaction list' };
  }

  async getTransactionList(planId) {
    try {
      const transaction = await this.accountRepository.getAccountInfoByPlanId(
        planId,
      );

      return { ok: true, transaction };
    } catch (error) {
      return { ok: false, message: 'failed to get transaction' };
    }
  }

  async updateTrnasactionVisible(transactionId): Promise<BasicOutput> {
    try {
      const transaction = await this.accountRepository.getTransactionById(
        transactionId,
      );
      if (!transaction)
        return { ok: false, message: 'cannot find this transaction' };
      const updatedTransaction =
        await this.accountRepository.updateTransactionVisible(
          transactionId,
          transaction.visible,
        );
      console.log(updatedTransaction);
      return { ok: true, message: 'success to update transaction' };
    } catch (error) {
      return { ok: false, message: 'failed to update transaction' };
    }
  }
}
