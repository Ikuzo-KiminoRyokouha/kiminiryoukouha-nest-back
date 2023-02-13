import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CustomRepository } from 'src/repositories/custom-repository.decorater';
import { throws } from 'assert';

@Injectable()
@CustomRepository(User)
export class UserRespository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async existsUser(email) {
    try {
      console.log(this.userRepository.findOneBy);
      const exists = await this.userRepository.findOneBy({ email });
      return exists;
    } catch (error) {
      throws;
    }
  }

  async existsNickname(nickname) {
    try {
      const exists = await this.userRepository.findOneBy({ nickname });
      return exists;
    } catch (error) {
      throws;
    }
  }

  async createUser(email, password, role, nickname) {
    try {
      const user = await this.userRepository.save(
        this.userRepository.create({ email, password, role, nickname }),
      );
      return user;
    } catch (error) {
      throws;
    }
  }

  async updateRefreshToken(userId, { refreshToken }) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      await this.userRepository.update({ id: userId }, { refreshToken });
    }
  }

  /**
   * @description userId에 해당하는 유저의 정보를 가져오는 데이터베이스 로직입니다.
   * @param userId 조회할 유저의 ID 값입니다.
   * @returns 조회된 유저의 값을 리턴해줍니다.
   */
  async getUser(userId: number) {
    try {
      return await this.userRepository.findOne({
        select: [
          'id',
          'nickname',
          'description',
          'followees',
          'followers',
          'role',
        ],
        where: { id: userId },
      });
    } catch (error) {
      console.log('error : ', error);
      throw new HttpException("Can't Found", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description 팔로우 눌렀을 때의 데이터베이스 로직입니다.
   * @param sourceId 팔로우를 누른 사람의 아이디 입니다.
   * @param targetId 팔로우를 눌려진 사람의 아이디 입니다.
   * @returns  success : void  error : Status Code 400 Can't Followed
   */
  async addFollower(sourceId: number, targetId: number) {
    try {
      const sourceUser = await this.userRepository.findOne({
        where: {
          id: sourceId,
        },
        relations: ['followers'],
      });
      const targetUser = await this.userRepository.findOne({
        where: {
          id: targetId,
        },
        relations: ['followees'],
      });

      // 팔로우를 누른 사람에게는 팔로워를 추가해줍니다.
      sourceUser.followers = [...sourceUser.followers, targetUser];

      // 팔로우를 눌려진 사람에게는 팔로이를 추가해줍니다.
      targetUser.followees = [...targetUser.followees, sourceUser];

      this.userRepository.save(sourceUser);
      this.userRepository.save(targetUser);
    } catch (error) {
      console.log(error);
      throw new HttpException("Can't Followed", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description 언팔로우 눌렀을 때의 데이터베이스 로직입니다.
   * @param sourceId 언팔로우를 누른 사람의 아이디 입니다.
   * @param targetId 언팔로우를 눌려진 사람의 아이디 입니다.
   * @returns  success : void  error : Status Code 400 Can't UnFollowed
   */
  async deleteFollower(sourceId: number, targetId: number) {
    try {
      const sourceUser = await this.userRepository.findOne({
        where: {
          id: sourceId,
        },
        relations: ['followers'],
      });
      const targetUser = await this.userRepository.findOne({
        where: {
          id: targetId,
        },
        relations: ['followees'],
      });

      // 언팔로우를 누른 사람에게는 팔로워를 삭제해줍니다.
      sourceUser.followers = sourceUser.followers.filter((el, idx) => {
        return el.id !== targetUser.id;
      });

      // 팔로우를 눌려진 사람에게는 팔로이를 삭제해줍니다.
      targetUser.followees = targetUser.followees.filter((el, idx) => {
        return el.id !== sourceUser.id;
      });

      this.userRepository.save(sourceUser);
      this.userRepository.save(targetUser);
    } catch (error) {
      console.log(error);
      throw new HttpException("Can't UnFollowed", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description 팔로워 조회 데이터베이스 로직입니다.
   * @param userId 팔로워를 조회하고싶은 사람의 Id입니다.
   * @returns  success : void  error : Status Code 400 Can't GetFollowers
   */
  async getFollowersInfo(userId: number) {
    try {
      return await this.userRepository.find({
        select: ['followers'],
        where: { id: userId },
        relations: ['followers'],
      });
    } catch (error) {
      throw new HttpException("Can't GetFollowers", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description 팔로우 눌렀을 때의 데이터베이스 로직입니다.
   * @param sourceId 팔로우를 누른 사람의 아이디 입니다.
   * @param targetId 팔로우를 눌려진 사람의 아이디 입니다.
   * @returns  success : void  error : Status Code 400 Can't GetFollowees
   */
  async getFolloweesInfo(userId: number) {
    try {
      return await this.userRepository.find({
        select: ['followees'],
        where: { id: userId },
        relations: ['followees'],
      });
    } catch (error) {
      throw new HttpException("Can't GetFollowees", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description 유저 소개글 업데이트 데이터베이스 로직입니다.
   * @param userId 업데이트할 유저 id 입니다.
   * @param description 업데이트할 유저 소개글 입니다.
   * @returns  success : void  error : Status Code 400 Can't Update
   */
  async updateDescription(userId: number, description: string) {
    try {
      return await this.userRepository.update(
        { id: userId },
        {
          description,
        },
      );
    } catch (error) {
      throw new HttpException("Can't Update", HttpStatus.BAD_REQUEST);
    }
  }
}
