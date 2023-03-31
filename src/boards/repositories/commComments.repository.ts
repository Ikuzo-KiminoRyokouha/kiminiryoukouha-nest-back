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

  async showComments(postId) {
    try {
      const selectedComments = await this.commCommentsRepository
        .createQueryBuilder('commcomment')
        .select(['commcomment.id', 'commcomment.content', 'user.email', 'user.nickname'])
        .where('commcomment.postId = :postId', { postId: postId })
        .leftJoin('commcomment.user', 'user')
        .getManyAndCount();

      console.log('selectedComments', selectedComments);
      return selectedComments;
    } catch (err) {
      console.log('err', err);
      return {
        comments: [],
      };
    }
  }
}
