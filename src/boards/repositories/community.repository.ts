import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomRepository } from '../../repositories/custom-repository.decorater';
import { CreateCommunityInput } from '../dtos/community/create-community.dto';
import { ShowCommunityInput } from '../dtos/community/show-community.dto';
import { UpdateCommunityInput } from '../dtos/community/update-community.dto';
import { Community } from '../entities';
import { Plan } from '../../travels/entities/plan.entity';
import { User } from '../../users/entities/user.entity';

type LimitOffset = ShowCommunityInput;

@Injectable()
@CustomRepository(Community)
export class CommunityRepository {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * @description 커뮤니티 생성 데이터 베이스 로직입니다
   * @param createCommunityInputDto  : 커뮤니티 생성에 필요한 정보들의 전송계층입니다.
   * @param userId  : 생성한 유저의 ID
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Created
   */
  async create(createCommunityInputDto: CreateCommunityInput, userId: number) {
    try {
      const { planId } = createCommunityInputDto;
      const plan = await this.planRepository.findOneBy({ id: planId });
      const user = await this.userRepository.findOneBy({ id: userId });

      return await this.communityRepository.save({
        ...createCommunityInputDto,
        plan,
        user,
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Can't Created", HttpStatus.BAD_REQUEST);
    }
  }

  async getBoardById(id: number) {
    const found = await this.communityRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return found;
  }

  /**
   * @description 커뮤니티 수정 데이터 베이스 로직입니다
   * @param updateCommunityInputDto  : 커뮤니티 수정에 필요한 정보들의 전송계층입니다.
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Created
   */
  async update(updateCommunityInputDto: UpdateCommunityInput, userId: number) {
    try {
      /* 기타 property와 id 분리 */
      const { id, planId, ...property } = updateCommunityInputDto;

      const plan = await this.planRepository.findOneBy({ id: planId });

      /* 생성자 본인의 요청인지 확인 */
      this.checkUser(id, userId);
      return await this.communityRepository.update(id, {
        plan,
        ...property,
      });
    } catch (error) {
      console.log(error);
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
    console.log(limit, offset);
    try {
      return await this.communityRepository.find({
        select: {
          id: true,
          img: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          deleteAt: true,
        },
        take: limit,
        skip: offset,
        relations: { plan: true },
        loadRelationIds: {
          relations: ['user'],
        },
      });
    } catch (error) {
      throw new HttpException("Can't Found", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description 커뮤니티 조회 데이터 베이스 로직입니다. 나의 정보만 받아옵니다.
   * @param userId: 유저 식별에 필요한 id 입니다
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Found
   */
  async findUserInfo(userId: number) {
    try {
      return await this.communityRepository.find({
        where: { userId },
        relations: { user: true },
      });
    } catch (error) {
      throw new HttpException("Can't Found", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description 커뮤니티 수정 데이터 베이스 로직입니다
   * @param id  : 커뮤니티 삭제에 필요한 community의 id 값입니다
   * @param userId : 유저 식별에 필요한 id 입니다
   * @returns  success : 성공한 Community에 대한 정보  error : Status Code 400 Can't Deleted
   */
  async delete(id: number, userId: number) {
    try {
      this.checkUser(id, userId);
      return await this.communityRepository.softDelete(id);
    } catch (error) {
      throw new HttpException("Can't Deleted", HttpStatus.BAD_REQUEST);
    }
  }

  async checkUser(id: number, userId: number) {
    const community = await this.communityRepository.findOneBy({ id });

    if (community.userId != userId) {
      throw new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED);
    }
  }
}
