import { Request } from 'express';

import { CreateCommunityInput } from '../dtos/community/create-community.dto';
import { ShowCommunityInput } from '../dtos/community/show-community.dto';
import { CommunityRepository } from '../repositories';
import { Injectable } from '@nestjs/common';
import { UpdateCommunityInput } from '../dtos/community/update-community.dto';

@Injectable()
export class CommunityService {
  constructor(private communityRepository: CommunityRepository) {}

  /**
   * @description 커뮤니티 조회  서비스 로직입니다 Polling 서비스에 쓰기위해 limit 와 offset을 설정했습니다
   * @param showCommunityInputDto  : 커뮤니티 조회시 필요한 Property를 담은 전송 계층 입니다.
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Found
   */
  async showCommunity(showCommunityInputDto: ShowCommunityInput) {
    return await this.communityRepository.findByLimitOffset(
      showCommunityInputDto,
    );
  }

  /**
   * @description 커뮤니티 생성  서비스 로직입니다
   * @param createCommunityInputDto  : 커뮤니티 생성시 필요한 Property를 담은 전송 계층 입니다.
   * @param req  : 요청에 대한 정보
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Not Created
   */
  async createCommunity(
    createCommunityInputDto: CreateCommunityInput,
    req: Request,
  ) {
    return await this.communityRepository.create(
      createCommunityInputDto,
      req.user['sub'],
    );
  }
  /**
   * @description 커뮤니티 수정 데이터 서비스 로직입니다
   * @param updateCommunityInputDto  : 커뮤니티 수정에 필요한 정보들의 전송계층입니다.
   * @param req : 요청에 대한 정보
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Created
   */
  async updateCommunity(
    updateCommunityInputDto: UpdateCommunityInput,
    req: Request,
  ) {
    return await this.communityRepository.update(
      updateCommunityInputDto,
      req.user['sub'],
    );
  }

  /**
   * @description 커뮤니티 수정 데이터 서비스 로직입니다
   * @param id  : 커뮤니티 삭제에 필요한 id 값입니다
   * @param req : 요청에 대한 정보
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Created
   */
  async deleteCommunity(id: number, req: Request) {
    return await this.communityRepository.delete(id, req.user['sub']);
  }

  /**
   * @description 커뮤니티 내 정보 조회 데이터 서비스 로직입니다
   * @param req : 요청에 대한 정보
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Found
   */
  async showUserCommunity(userId: number) {
    return await this.communityRepository.findUserInfo(userId);
  }
}
