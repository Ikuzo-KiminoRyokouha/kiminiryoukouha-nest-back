import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class Comment extends BasicEntity {
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @RelationId((comment: Comment) => comment.user)
  // @JoinColumn({ referencedColumnName: 'email' })
  userId: number;

  @ManyToOne(() => Board, (board) => board.id)
  board: Board;
  @RelationId((comment: Comment) => comment.board)
  @IsNumber()
  boardId: number;

  @ManyToOne(() => Comment, (comment) => comment.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  group: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  target: User;
  @RelationId((comment: Comment) => comment.target)
  @IsNumber()
  @IsOptional()
  targetId: number;

  @Column()
  @IsString()
  content: string;
}
