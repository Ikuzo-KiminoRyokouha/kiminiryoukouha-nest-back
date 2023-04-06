import { Body, Injectable } from '@nestjs/common';
import { CreateCommCommentInput, CreateCommCommentOutput } from '../dtos/community/create-commComment.dto';
import { CommCommentsRepository } from '../repositories/commComments.repository';

@Injectable()
export class CommCommentsService {
  constructor(private readonly commCommentsRepository: CommCommentsRepository) {}
  async showComments1(): Promise<string> {
    return '응애1';
  }

  async showComment(id): Promise<string> {
    return `응애2${id}`;
  }

  async test1(id): Promise<string> {
    return `test${id}`;
  }

  async createComment(content: CreateCommCommentInput, user): Promise<CreateCommCommentOutput> {
    try {
      await this.commCommentsRepository.createComment({ ...content }, user);
      return {
        ok: true,
        message: 'create comment',
      };
    } catch (err) {
      return {
        ok: false,
        message: 'faild to create comment',
      };
    }
  }

  async showComments(postId: number) {
    try {
      const { comments, count } = await this.commCommentsRepository.showComments(postId);
      if (!comments[0]) {
        return {
          ok: false,
          message: 'not found any comment',
        };
      }
      return {
        ok: true,
        count,
        comments,
      };
    } catch (err) {
      console.log('err', err);
      return {
        ok: false,
        error: 'failed to show comments',
      };
    }
  }

  async updateComment(commentId: number, updateCommentInput: CreateCommCommentInput, user) {
    try {
      const comment = await this.commCommentsRepository.showComment(commentId);
      if (!comment) {
        return {
          ok: false,
          error: 'comment not found',
        };
      }

      if (user.sub != comment.userId) {
        return {
          ok: false,
          error: "you don't have permission",
        };
      }

      const check = await this.commCommentsRepository.updateComment(commentId, updateCommentInput);

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
    } catch (err) {
      console.log('err', err);
      return {
        ok: false,
        error: 'failed to update comments',
      };
    }
  }

  async deleteComment(commentId, user) {
    try {
      const comment = await this.commCommentsRepository.showComment(commentId);
      if (!comment) {
        return {
          ok: false,
          error: 'comment not found',
        };
      }

      if (user.sub != comment.userId) {
        return {
          ok: false,
          error: "you don't have permission",
        };
      }

      const check = await this.commCommentsRepository.deleteComment(commentId);
      if (!check) {
        return {
          ok: false,
          error: 'failed to delete comment1',
        };
      }
      return {
        ok: true,
        message: 'delete comment',
      };
    } catch (err) {
      console.log('err', err);
      return {
        ok: false,
        error: 'failed to delete comment2',
      };
    }
  }
}
