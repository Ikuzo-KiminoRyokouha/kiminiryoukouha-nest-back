import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './board/boards.controller';
import { BoardsService } from './board/boards.service';
import { Board } from './entities/board.entity';
import { BoardsRepository } from './board/boards.repository';
import { CommentsRepository } from './comment/comments.repository';
import { Comment } from './entities/comment.entity';
import { CommentsController } from './comment/comments.controller';
import { CommentsService } from './comment/comments.service';
import { UserRespository } from 'src/users/users.repository';
import { TypeOrmExModule } from 'src/repositories/custom-repository.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Comment]),
    TypeOrmExModule.forCustomRepository([UserRespository]),
  ],
  controllers: [BoardsController, CommentsController],
  providers: [
    BoardsService,
    CommentsService,
    BoardsRepository,
    CommentsRepository,
  ],
})
export class BoardModule {}
