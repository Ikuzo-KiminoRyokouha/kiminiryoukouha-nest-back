import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Community } from './community.entity';

@Entity({ name: 'commcomment' })
export class CommComments extends BasicEntity {
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @RelationId((comment: CommComments) => comment.user)
  userId: number;

  @ManyToOne(() => Community, (community) => community.id)
  community: Community;
  @RelationId((comment: CommComments) => comment.community)
  @IsNumber()
  postId: number;

  @Column({ type: 'varchar', length: 1000 })
  @IsNotEmpty()
  content: string;

  @Column()
  @IsNumber()
  depth: number;

  @Column()
  @IsNumber()
  order: number;

  @ManyToOne(() => CommComments, (commComment) => commComment.id, { nullable: true })
  target: CommComments;
  @RelationId((comment: CommComments) => comment.target)
  @IsNumber()
  @IsOptional()
  targetId: number;
}

/**
- userId - 누가썼는가
- postId - 어느 포스트에 썼는가 -> 무조건 있어야함
- content - 내용 -> 무조건 있어야함
- depth - 몇번째 댓글(대댓글)인가 —> 첫번째 댓글 depth - 0 ---> default = 0 
- order - 순서 (댓글, 대댓글끼리의 순서) -> 있어야 할듯
- targetId - 어느 댓글이 부모 댓글인가
 */
