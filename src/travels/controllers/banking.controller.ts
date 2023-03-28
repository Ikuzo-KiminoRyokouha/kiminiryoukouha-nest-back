import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { CreateBankingTokenInput } from '../dtos/banking/creacte-bankingToken.dto';
import { CreateTransactionInput } from '../dtos/banking/create-transaction.dto';
import { SaveCountInput } from '../dtos/banking/save-count-dto';
import { ShowAccountsOutput } from '../dtos/banking/show-accounts.dto';
import { ShowTransactionOut } from '../dtos/banking/show-transaction.dto';

import { BankingService } from '../services/banking.service';

@Controller('banking')
export class BankingController {
  constructor(private bankingService: BankingService) {}

  //code를 이용한 토큰발급
  @UseGuards(AccessTokenGuard)
  @Post('/authCode')
  async createBankingToken(
    @Req() req: Request,
    @Body() createBankingTokenInput: CreateBankingTokenInput,
  ): Promise<BasicOutput> {
    return await this.bankingService.createBankingToken(
      createBankingTokenInput,
      req.user['sub'],
    );
  }

  // 나의 등록된 계좌들
  @UseGuards(AccessTokenGuard)
  @Get('/myinfo')
  async getMyBankingInfo(@Req() req: Request): Promise<ShowAccountsOutput> {
    return this.bankingService.getMyBankingInfo(req.user['sub']);
  }

  //대표 계좌 설정
  @UseGuards(AccessTokenGuard)
  @Post('/my/count')
  async saveMyCount(
    @Req() req: Request,
    @Body() saveCountInput: SaveCountInput,
  ): Promise<BasicOutput> {
    return this.bankingService.saveMyCount(saveCountInput, req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/transaction/list')
  async createTransactionList(
    @Req() req: Request,
    @Body() createTransactionInput: CreateTransactionInput,
  ): Promise<BasicOutput> {
    return this.bankingService.createTransactionList(
      createTransactionInput,
      req.user['sub'],
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('/transaction/list/:planId')
  async getTransactionList(
    @Param('planId') planId: number,
  ): Promise<ShowTransactionOut> {
    return this.bankingService.getTransactionList(planId);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/transaction/list/:transactionId')
  async updateTransactionVisible(
    @Param('transactionId') transactionId: number,
  ): Promise<BasicOutput> {
    return this.bankingService.updateTrnasactionVisible(transactionId);
  }

  // @Delete('/transaction/list')
  // async deleteTransactionList() {
  //   const deleteAccountData =
  //     await this.accountRepository.deleteTransactionListById(131);

  //   console.log(deleteAccountData);
  // }
}
