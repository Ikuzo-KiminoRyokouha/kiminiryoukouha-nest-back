import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { Repository } from 'typeorm';
import { BankingToken } from '../entities/bankingToken.entity';

@Injectable()
export class BankingRepository {
  constructor(
    @InjectRepository(BankingToken)
    private readonly bankingTokenRepository: Repository<BankingToken>,
  ) {}

  async createBankingAccessToken(
    accessToken: string,
    refreshToken: string,
    userNo: string,
    userId: number,
  ): Promise<BankingToken> {
    try {
      console.log('brd');
      const token = await this.bankingTokenRepository.save(
        this.bankingTokenRepository.create({
          accessToken,
          refreshToken,
          userNo,
          userId,
        }),
      );
      return token;
    } catch (error) {
      console.log(error);
      throws;
    }
  }

  async getBankingToken(userId: number): Promise<BankingToken> {
    const token = await this.bankingTokenRepository.findOne({
      where: { userId },
    });
    return token;
  }

  async getBankingBasicInfo(userId) {
    const bankingInfo = await this.bankingTokenRepository.findOne({
      where: { userId },
      select: ['bank_name', 'account_num'],
    });
    return bankingInfo;
  }

  async saveMyAccountInfo(
    userNo: string,
    finNum: string,
    bank_name,
    account_num,
  ) {
    try {
      const fin = await this.bankingTokenRepository.save([
        { userNo, finNum, bank_name, account_num },
      ]);
      return fin;
    } catch (error) {
      console.log('saveMyFinNum err', error);
      throws;
    }
  }

  async updateCheckNum(token: BankingToken) {
    const checkNum = await this.bankingTokenRepository.update(token.userNo, {
      checking: () => 'checking + 1',
    });
    token.checking += 1;
    return token;
  }
}
