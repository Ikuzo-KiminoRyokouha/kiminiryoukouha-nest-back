import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/repositories/custom-repository.module';
import { UserRespository } from 'src/users/users.repository';

import {
  BoardsController,
  CommentsController,
  CommunityController,
} from './controller';
import { Board, Comment, Community } from './entities';
import {
  BoardsRepository,
  CommentsRepository,
  CommunityRepository,
} from './repositories';
import { BoardsService, CommentsService, CommunityService } from './services';
import { Plan } from '../travels/entities/plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Comment, Community, Plan]),
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
