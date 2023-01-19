import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CustomRepository } from 'src/repositories/custom-repository.decorater';
import { throws } from 'assert';

@Injectable()
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
}
