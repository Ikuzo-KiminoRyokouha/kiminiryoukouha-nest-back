import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from '../dtos/comment/create-comment.dto';
import { DeleteCommentOuput } from '../dtos/comment/delete-comment.dto';
import { ShowCommentsOutput } from '../dtos/comment/show-comments.dto';
import {
  UpdateCommentInput,
  updateCommentOutput,
} from '../dtos/comment/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createComment(
    createComment: CreateCommentInput,
    user,
  ): Promise<CreateCommentOutput> {
    try {
      await this.commentsRepository.createComment(
        {
          ...createComment,
        },
        user,
      );
      return {
        ok: true,
        message: 'create comment',
      };
    } catch (error) {
      return {
        ok: false,
        message: 'faild to create comment',
      };
    }
  }

  async showComments(boardId: number): Promise<ShowCommentsOutput> {
    try {
      console.log('ddd');
      const { comments, count } = await this.commentsRepository.showComments(
        boardId,
      );
      if (!comments[0]) {
        return {
          ok: false,
          message: 'not found any comment',
        };
      }
      console.log('ser');
      console.log(comments, count);
      return {
        ok: true,
        count,
        comments,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'failed to show comments',
      };
    }
  }

  async updateComment(
    commentId: number,
    updateCommentInput: UpdateCommentInput,
    user,
  ): Promise<updateCommentOutput> {
    try {
      const comment = await this.commentsRepository.showComment(commentId);
      if (!comment) {
        return {
          ok: false,
          error: 'comment not found',
        };
      }
      if (user.sub != comment.userId) {
        return {
          ok: false,
          error: 'you can not update this comment',
        };
      }
      const check = await this.commentsRepository.updateComment(
        commentId,
        updateCommentInput,
      );
      if (!check) {
        return {
          ok: false,
          error: 'failed to update comment',
        };
      }
      return {
        ok: true,
        message: 'update comment',
      };
    } catch (error) {
      return {
        ok: false,
        error: 'failed to update comments',
      };
    }
  }

  async deleteComment(commentId: number, user): Promise<DeleteCommentOuput> {
    try {
      const comment = await this.commentsRepository.showComment(commentId);
      if (!comment) {
        return {
          ok: false,
          error: 'comment not found',
        };
      }
      if (user.sub != comment.userId) {
        return {
          ok: false,
          error: 'you can not update this comment',
        };
      }
      const check = await this.commentsRepository.deleteComment(commentId);
      if (!check) {
        return {
          ok: false,
          error: 'failed to delete comment',
        };
      }
      return {
        ok: true,
        message: 'delete comment',
      };
    } catch (e) {
      return {
        ok: false,
        error: 'failed to delete comment',
      };
    }
  }
}
