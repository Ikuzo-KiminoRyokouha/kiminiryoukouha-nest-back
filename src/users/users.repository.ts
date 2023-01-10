import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CustomRepository } from 'src/repositories/custom-repository.decorater';

@Injectable()
@CustomRepository(User)
export class UserRespository extends Repository<User> {
  async existsUser(email) {
    const exists = await this.findOneBy({ email });
    return exists;
  }

  async createUser(email, password, role, nickname) {
    const user = await this.save(
      this.create({ email, password, role, nickname }),
    );
    return user;
  }

  async updateRefreshToken(userId, { refreshToken }) {
    const user = await this.findOneBy({ id: userId });
    if (user) {
      await this.update({ id: userId }, { refreshToken });
    }
  }
}
