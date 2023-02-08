import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { FollowUserInput } from '../dtos/follow-user.dto';
import { GetUserInput } from '../dtos/get-user.dto';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/Info')
  async getUserInfo(@Body() getUserInputDto: GetUserInput) {
    return await this.usersService.getUserInfo(getUserInputDto.userId);
  }

  @Get('/info/follwer')
  getFollowerInfo() {}

  @Get('/info/follwee')
  getFolloweeInfo() {}

  @Post('/update/description')
  updateDescription() {}

  @Post('/follow')
  async followUser(@Body() followUserInputDto: FollowUserInput) {
    const { sourceId, targetId } = followUserInputDto;
    return await this.usersService.followUser(sourceId, targetId);
  }

  @Post('/unfollow')
  unFollowUser() {}
}
