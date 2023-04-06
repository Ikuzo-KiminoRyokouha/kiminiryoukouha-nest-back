import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommComments } from '../entities/commComments.entity';

@Injectable()
export class CommCommentsRepository {
  constructor(
    @InjectRepository(CommComments)
    private readonly commCommentsRepository: Repository<CommComments>,
  ) {}

  async createComment({ postId, depth, content, targetId, order }, user) {
    try {
      await this.commCommentsRepository.save(
        this.commCommentsRepository.create({
          content,
          user: user.sub,
          depth,
          community: postId,
          target: targetId,
          order,
        }),
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async showComment(commentId) {
    try {
      const comment = await this.commCommentsRepository.findOne({
        where: { id: commentId },
      });
      if (!comment) {
        return false;
      }
      return comment;
    } catch (err) {
      console.log('err', err);
      return false;
    }
  }

  async showComments(postId) {
    try {
      const selectedComments = await this.commCommentsRepository
        .createQueryBuilder('commcomment')
        .select(['commcomment', 'user.email', 'user.nickname', 'user.id'])
        .where('commcomment.communityId = :postId', { postId: postId })
        .leftJoin('commcomment.user', 'user')
        .getManyAndCount();

      // console.log('selectedComments', selectedComments);
      const comments = selectedComments[0];
      const count = Math.ceil(selectedComments[1]);
      // console.log('comments', comments);
      // console.log('count', count);
      return {
        comments,
        count,
      };
    } catch (err) {
      console.log('err', err);
      return {
        comments: [],
      };
    }
  }

  async updateComment(commentId, updateCommentInput) {
    try {
      await this.commCommentsRepository.save([{ id: commentId, ...updateCommentInput }]);
      return true;
    } catch (err) {
      console.log('err', err);
      return false;
    }
  }

  async deleteComment(commentId) {
    try {
      await this.commCommentsRepository.softDelete({ id: commentId });
      return true;
    } catch (err) {
      console.log('err', err);
      return false;
    }
  }
}
