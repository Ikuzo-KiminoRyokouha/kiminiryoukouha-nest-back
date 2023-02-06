import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomRepository } from '../../repositories/custom-repository.decorater';
import { CreateCommunityInput } from '../dtos/community/create-community.dto';
import { ShowCommunityInput } from '../dtos/community/show-community.dto';
import { UpdateCommunityInput } from '../dtos/community/update-community.dto';
import { Community } from '../entities';

interface LimitOffset extends ShowCommunityInput {}

@Injectable()
@CustomRepository(Community)
export class CommunityRepository {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
  ) {}

  /**
   * @description 커뮤니티 생성 데이터 베이스 로직입니다
   * @param createCommunityInputDto  : 커뮤니티 생성에 필요한 정보들의 전송계층입니다.
   * @param userId  : 생성한 유저의 ID
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Created
   */
  async create(createCommunityInputDto: CreateCommunityInput, userId: number) {
    try {
      return await this.communityRepository.save({
        ...createCommunityInputDto,
        userId,
      });
    } catch (error) {
      throw new HttpException("Can't Created", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description 커뮤니티 수정 데이터 베이스 로직입니다
   * @param updateCommunityInputDto  : 커뮤니티 수정에 필요한 정보들의 전송계층입니다.
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Created
   */
  async update(updateCommunityInputDto: UpdateCommunityInput, userId: number) {
    try {
      /* 기타 property와 id 분리 */
      const { id, ...property } = updateCommunityInputDto;

      const community = await this.communityRepository.findOneBy({ id });
      console.log(community.userId);
      console.log(userId);
      /* 생성자 본인의 요청인지 확인 */
      if (community.userId !== userId)
        throw new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED);
      return await this.communityRepository.update(id, property);
    } catch (error) {
      throw new HttpException("Can't Update", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description 커뮤니티 조회 데이터 베이스 로직입니다. 최대갯수와 시작idx가 정해져있습니다.
   * @param option
   *
   *      limit  : 조회 최대 갯수
   *
   *      offset  : 시작 인덱스
   *
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Found
   */
  async findByLimitOffset(option: LimitOffset) {
    const { limit, offset } = option;
    try {
      return await this.communityRepository.find({
        take: limit,
        skip: offset,
      });
    } catch (error) {
      throw new HttpException("Can't Found", HttpStatus.BAD_REQUEST);
    }
  }
}
