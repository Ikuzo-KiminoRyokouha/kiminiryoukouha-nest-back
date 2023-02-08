import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/repositories/custom-repository.module';
import { UserRespository } from 'src/users/repositories/users.repository';

import {
  BoardsController,
  CommentsController,
  CommunityController,
} from './controllers';
import { Board, Comment, Community } from './entities';
import {
  BoardsRepository,
  CommentsRepository,
  CommunityRepository,
} from './repositories';
import { BoardsService, CommentsService, CommunityService } from './services';
import { Plan } from '../travels/entities/plan.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Comment, Community, Plan, User]),
    TypeOrmExModule.forCustomRepository([UserRespository]),
  ],
  controllers: [BoardsController, CommentsController, CommunityController],
  providers: [
    BoardsService,
    CommentsService,
    CommunityService,
    BoardsRepository,
    CommentsRepository,
    CommunityRepository,
  ],
})
export class BoardModule {}
