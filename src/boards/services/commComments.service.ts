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
      await this.commCommentsRepository.showComments(postId);
    } catch (err) {
      console.log('err', err);
      return {
        ok: false,
        error: 'failed to show comments',
      };
    }
  }
}
