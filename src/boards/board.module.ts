import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/repositories/custom-repository.module';
import { UserRespository } from 'src/users/users.repository';

import {
  BoardsController,
  CommentsController,
  CommunityController,
  DiaryController,
} from './controller';
import { Board, Comment, Community, Diary } from './entities';
import {
  BoardsRepository,
  CommentsRepository,
  CommunityRepository,
  DiaryRepository,
} from './repositories';
import {
  BoardsService,
  CommentsService,
  CommunityService,
  DiaryService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Comment, Diary, Community]),
    TypeOrmExModule.forCustomRepository([UserRespository]),
  ],
  controllers: [
    BoardsController,
    CommentsController,
    CommunityController,
    DiaryController,
  ],
  providers: [
    BoardsService,
    CommentsService,
    CommunityService,
    DiaryService,
    BoardsRepository,
    CommentsRepository,
    CommunityRepository,
    DiaryRepository,
  ],
})
export class BoardModule {}
