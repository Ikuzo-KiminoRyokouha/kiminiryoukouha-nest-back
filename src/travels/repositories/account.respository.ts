import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createAccountInfo(date, time, inOrOut, amount, name, planId) {
    const accountInfo = await this.accountRepository.save(
      this.accountRepository.create({
        date,
        time,
        inOrOut,
        amount,
        name,
        planId,
      }),
    );
    return accountInfo;
  }

  async getAccountInfoByPlanId(planId): Promise<Account[]> {
    const accountInfo = await this.accountRepository.find({
      where: {
        planId,
      },
      order: {
        date: 'DESC',
        time: 'DESC',
      },
    });

    return accountInfo;
  }

  async getAccountInfoByDate(date, planId): Promise<Account[]> {
    const accountInfo = await this.accountRepository.find({
      where: {
        date,
        planId,
      },
    });
    return accountInfo;
  }

  async updateTransactionVisible(transactionId, visible: boolean) {
    try {
      console.log('rep', transactionId, !visible);

      await this.accountRepository.save([
        {
          id: transactionId,
          visible: !visible,
        },
      ]);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async getTransactionById(transactionId) {
    const transaction = await this.accountRepository.findOne({
      where: {
        id: transactionId,
      },
    });

    return transaction;
  }

  async deleteTransactionListById(accountInfoId): Promise<DeleteResult> {
    const deleteAccountData = await this.accountRepository.delete({
      id: accountInfoId,
    });
    return deleteAccountData;
  }
}
