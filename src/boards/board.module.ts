import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/repositories/custom-repository.module';
import { UserRespository } from 'src/users/repositories/users.repository';

import { BoardsController, commCommentsController, CommentsController, CommunityController } from './controllers';
import { Board, CommComments, Comment, Community } from './entities';
import { BoardsRepository, CommCommentsRepository, CommentsRepository, CommunityRepository } from './repositories';
import { BoardsService, CommCommentsService, CommentsService, CommunityService } from './services';
import { Plan } from '../travels/entities/plan.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Comment, Community, Plan, User, CommComments]),
    TypeOrmExModule.forCustomRepository([UserRespository]),
  ],
  controllers: [BoardsController, CommentsController, CommunityController, commCommentsController],
  providers: [
    BoardsService,
    CommentsService,
    CommunityService,
    CommCommentsService,
    BoardsRepository,
    CommentsRepository,
    CommunityRepository,
    CommCommentsRepository,
  ],
})
export class BoardModule {}
