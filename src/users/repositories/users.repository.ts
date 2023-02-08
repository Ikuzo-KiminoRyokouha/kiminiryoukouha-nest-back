import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CustomRepository } from 'src/repositories/custom-repository.decorater';
import { throws } from 'assert';

@CustomRepository(User)
export class UserRespository extends Repository<User> {
  async existsUser(email) {
    try {
      const exists = await this.findOneBy({ email });
      return exists;
    } catch (error) {
      throws;
    }
  }

  async existsNickname(nickname) {
    try {
      const exists = await this.findOneBy({ nickname });
      return exists;
    } catch (error) {
      throws;
    }
  }

  async createUser(email, password, role, nickname) {
    try {
      const user = await this.save(
        this.create({ email, password, role, nickname }),
      );
      return user;
    } catch (error) {
      throws;
    }
  }

  async updateRefreshToken(userId, { refreshToken }) {
    const user = await this.findOneBy({ id: userId });
    if (user) {
      await this.update({ id: userId }, { refreshToken });
    }
  }

  /**
   * @description userId에 해당하는 유저의 정보를 가져오는 데이터베이스 로직입니다.
   * @param userId 조회할 유저의 ID 값입니다.
   * @returns 조회된 유저의 값을 리턴해줍니다.
   */
  async getUser(userId: number) {
    try {
      return await this.find({
        select: ['id', 'nickname', 'description', 'followees', 'followers'],
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
      const sourceUser = await this.findOneBy({ id: sourceId });
      const targetUser = await this.findOneBy({ id: targetId });

      // 팔로우를 누른 사람에게는 팔로워를 추가해줍니다.
      this.update(
        { id: sourceId },
        { followers: [...sourceUser.followers, targetUser] },
      );

      // 팔로우를 눌려진 사람에게는 팔로이를 추가해줍니다.
      this.update(
        { id: targetId },
        { followees: [...targetUser.followees, sourceUser] },
      );
    } catch (error) {
      console.log(error);
      throw new HttpException("Can't Followed", HttpStatus.BAD_REQUEST);
    }
  }

  async getFolloweesInfo() {}
}
