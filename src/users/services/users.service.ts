import { Injectable } from '@nestjs/common';
import { UserRespository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRespository) {}

  /**
   * @description 팔로우 눌렀을 때의 서비스 로직입니다.
   * @param sourceId 팔로우를 누른 사람의 아이디 입니다.
   * @param targetId 팔로우를 눌려진 사람의 아이디 입니다.
   * @returns  success : void  error : Status Code 400 Can't Followed
   */
  async followUser(sourceId: number, targetId: number) {
    return await this.userRepository.addFollower(sourceId, targetId);
  }

  async getUserInfo(userId: number) {}

  unFollowUser() {}
}
