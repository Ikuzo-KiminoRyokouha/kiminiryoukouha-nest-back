import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRespository } from 'src/users/users.repository';
import { Repository } from 'typeorm';
import { BoardsRepository } from '../board/boards.repository';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly boardRepository: BoardsRepository,
    private readonly userRespository: UserRespository,
  ) {}

  async createComment({ boardId, group, targetId, content }, user) {
    try {
      const comment = await this.commentRepository.save(
        this.commentRepository.create({
          board: boardId,
          target: targetId,
          group,
          user: user.sub,
          content,
        }),
      );
      const checkUserRole = await this.userRespository.findOne({
        where: { id: user.sub },
      });

      if (checkUserRole.role == 'Manager') {
        const check = await this.boardRepository.updateBoard(comment.board, {
          complete: true,
        });
      }
      if (comment.group == null) {
        await this.commentRepository.save([
          {
            id: comment.id,
            group: comment.id,
          },
        ]);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async showComment(commentId) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });
      if (!comment) {
        return false;
      }
      return comment;
    } catch (error) {
      return false;
    }
  }
  async showComments(boardId) {
    try {
      const selectedComments = await this.commentRepository
        .createQueryBuilder('comment')
        .select([
          'comment.id',
          'comment.content',
          'user.email',
          'user.nickname',
        ])
        .where('comment.boardId = :boardId', { boardId: boardId })
        .leftJoin('comment.user', 'user')
        .getManyAndCount();

      const comments = selectedComments[0];
      const count = Math.ceil(selectedComments[1] / 6);
      return {
        comments,
        count,
      };
    } catch (error) {
      return {
        comments: [],
      };
    }
  }

  async updateComment(commentId, updateCommentsInput) {
    try {
      await this.commentRepository.save([
        { id: commentId, ...updateCommentsInput },
      ]);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteComment(commentId) {
    try {
      await this.commentRepository.softDelete({ id: commentId });
      return true;
    } catch (error) {
      return false;
    }
  }
}
