import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { UserRespository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { TypeOrmExModule } from '../repositories/custom-repository.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmExModule.forCustomRepository([UserRespository]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRespository],
})
export class UsersModule {}
