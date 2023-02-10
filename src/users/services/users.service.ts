import { Body, Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from '../dtos/create-user.dto';
import { LoginInput, LoginOutput } from '../dtos/login.dto';
import { UserRespository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRespository) {}

  /**
   * @description 유저 조회 서비스 로직입니다.
   * @param userId 조회할 유저의 아이디 값입니다.
   * @returns  success : void  error : Status Code 400 Can't Followed
   */
  async getUserInfo(userId: number) {
    return await this.userRepository.getUser(userId);
  }

  /**
   * @description 팔로우 눌렀을 때의 서비스 로직입니다.
   * @param sourceId 팔로우를 누른 사람의 아이디 입니다.
   * @param targetId 팔로우를 눌려진 사람의 아이디 입니다.
   * @returns  success : void  error : Status Code 400 Can't Followed
   */
  async followUser(sourceId: number, targetId: number) {
    return await this.userRepository.addFollower(sourceId, targetId);
  }

  /**
   * @description 언팔로우 눌렀을 때의 서비스 로직입니다.
   * @param sourceId 언팔로우를 누른 사람의 아이디 입니다.
   * @param targetId 언팔로우를 눌려진 사람의 아이디 입니다.
   * @returns  success : void  error : Status Code 400 Can't UnFollowed
   */
  async unFollowUser(sourceId: number, targetId: number) {
    return await this.userRepository.deleteFollower(sourceId, targetId);
  }

  /**
   * @description 팔로워 조회 서비스 로직입니다.
   * @param userId 팔로워를 조회하고싶은 사람의 Id입니다.
   * @returns  success : void  error : Status Code 400 Can't GetFollowers
   */
  async getFollowersInfo(userId: number) {
    return await this.userRepository.getFollowersInfo(userId);
  }

  /**
   * @description 팔로우 눌렀을 때의 서비스 로직입니다.
   * @param sourceId 팔로우를 누른 사람의 아이디 입니다.
   * @param targetId 팔로우를 눌려진 사람의 아이디 입니다.
   * @returns  success : void  error : Status Code 400 Can't GetFollowees
   */
  async getFolloweesInfo(userId: number) {
    return await this.userRepository.getFolloweesInfo(userId);
  }

  /**
   * @description 유저 소개글 업데이트 서비스 로직입니다.
   * @param userId 업데이트할 유저의 id 입니다.
   * @param description 업데이트할 유저 소개글 입니다.
   * @returns  success : void  error : Status Code 400 Can't Update
   */
  async updateDescription(userId: number, description: string) {
    return await this.userRepository.updateDescription(userId, description);
  }
}
