import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { FollowUserInput } from '../dtos/follow-user.dto';
import { GetUserInput } from '../dtos/get-user.dto';
import { Request } from 'express';
import { UpdateDescriptionInput } from '../dtos/update-description.dto';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description [GET] 유저 정보 조회 컨트롤러입니다.
   * @param userId  : 조회할 유저 아이디
   * @returns  success : 성공한 유저에 대한 정보  error : Status Code 400 Can't Found
   */
  @Get('/info')
  async getUserInfo(@Query() getUserInputDto: GetUserInput) {
    const { userId } = getUserInputDto;
    return await this.usersService.getUserInfo(userId);
  }

  /**
   * @description [GET] 유저의 팔로워 정보 조회 컨트롤러입니다.
   * @returns  success : 성공한 유저의 팔로워에 대한 정보  error : Status Code 400 Can't Found
   */
  @Get('/info/follower')
  async getFollowerInfo(@Req() req: Request) {
    return await this.usersService.getFollowersInfo(req.user['sub']);
  }

  /**
   * @description [GET] 유저의 팔로잉 정보 조회 컨트롤러입니다.
   * @returns  success : 성공한 유저의 팔로잉에 대한 정보  error : Status Code 400 Can't Found
   */
  @Get('/info/followee')
  async getFolloweeInfo(@Req() req: Request) {
    return await this.usersService.getFolloweesInfo(req.user['sub']);
  }

  /**
   * @description [POST] 유저 설명 업데이트 컨트롤러입니다.
   * @param updateDescriptionInputDto 유저 설명 업데이트에 필요한 정보들의 전송계층입니다.
   * @returns  success : 성공한 유저에 대한 정보  error : Status Code 400 Can't Found
   */
  @Post('/update/description')
  async updateDescription(
    @Body() updateDescriptionInputDto: UpdateDescriptionInput,
    @Req() req: Request,
  ) {
    return await this.usersService.updateDescription(
      req.user['sub'],
      updateDescriptionInputDto.description,
    );
  }

  /**
   * @description [POST] 유저 팔로우 눌렀을 때 발생하는 이벤트 컨트롤러입니다.
   * @param FollowUserInput 유저 팔로우에 대한 정보의 전송계층입니다.
   * @returns  success : 성공한 유저에 대한 정보  error : Status Code 400 Can't Found
   */
  @Post('/follow')
  async followUser(
    @Body() followUserInputDto: FollowUserInput,
    @Req() req: Request,
  ) {
    const { targetId } = followUserInputDto;
    return await this.usersService.followUser(req.user['sub'], targetId);
  }

  @Get()
  getUser(@Req() req: Request) {
    return req.user;
  }

  /**
   * @description [POST] 유저 언팔로우 눌렀을 때 발생하는 이벤트 컨트롤러입니다.
   * @param FollowUserInput 유저 언팔로우에 대한 정보의 전송계층입니다.
   * @returns  success : 성공한 유저에 대한 정보  error : Status Code 400 Can't Found
   */
  @Post('/unfollow')
  async unFollowUser(
    @Body() followUserInputDto: FollowUserInput,
    @Req() req: Request,
  ) {
    const { targetId } = followUserInputDto;

    return await this.usersService.unFollowUser(req.user['sub'], targetId);
  }
}
