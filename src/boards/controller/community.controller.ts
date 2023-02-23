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

import {
  ShowCommunityInput,
  ShowCommunityOutput,
} from '../dtos/community/show-community.dto';
import { CommunityService } from '../services';
import { Request } from 'express';
import { CreateCommunityInput } from '../dtos/community/create-community.dto';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { UpdateCommunityInput } from '../dtos/community/update-community.dto';
import { DeleteCommunityInput } from '../dtos/community/delete-community.dto';

@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  /**
   * @description [GET] 커뮤니티 조회  컨트롤러입니다 Polling 서비스에 쓰기위해 limit 와 offset을  QS로 받아옵니다.
   * @param limit  : 조회 최대 갯수
   * @param offset  : 시작 인덱스
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Found
   */
  @Get('/')
  showCommunity(
    @Param() showCommunityInput: ShowCommunityInput,
  ): ShowCommunityOutput {
    return this.communityService.showCommunity(showCommunityInput);
  }
  @Get('/:id')
  getBoardByid(@Param('id') id: number) {
    return this.communityService.getBoardById(id);
  }

  /**
   * @description [POST] 커뮤니티 생성  컨트롤러입니다
   * @param createCommunityInputDto  : 커뮤니티 생성에 필요한 정보들의 전송계층입니다.
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Can't Created
   */
  @UseGuards(AccessTokenGuard)
  @Post('/')
  createCommunity(
    @Body() createCommunityInputDto: CreateCommunityInput,
    @Req() req: Request,
  ) {
    return this.communityService.createCommunity(createCommunityInputDto, req);
  }

  /**
   * @description [PUT] 커뮤니티 수정  컨트롤러입니다
   * @param updateCommunityInputDto  : 커뮤니티 수정에 필요한 정보들의 전송계층입니다.
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Can't Created
   */
  @UseGuards(AccessTokenGuard)
  @Put('/')
  updateCommunity(
    @Body() updateCommunityInputDto: UpdateCommunityInput,
    @Req() req: Request,
  ) {
    return this.communityService.updateCommunity(updateCommunityInputDto, req);
  }

  /**
   * @description [DELETE] 커뮤니티 생성  컨트롤러입니다
   * @param deleteCommunityInputDto  : 커뮤니티 수정에 필요한 정보들의 전송계층입니다.
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Can't Created
   */
  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  deleteCommunity(@Param('id') id: number, @Req() req: Request) {
    console.log(req);
    console.log('123123');
    return this.communityService.deleteCommunity(id, req);
  }

  /**
   * @description [GET] 커뮤니티 내가 쓴 정보 조회  컨트롤러입니다
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Can't Created
   */
  @UseGuards(AccessTokenGuard)
  @Get('/my')
  showMyStroy(@Req() req: Request) {
    return this.communityService.showMyCommunity(req);
  }
}
