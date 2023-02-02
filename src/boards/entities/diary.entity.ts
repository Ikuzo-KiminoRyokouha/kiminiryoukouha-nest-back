import { IsNumber, IsString } from 'class-validator';
import { BasicEntity } from 'src/common/entities/basic.entity';
import { Plan } from 'src/travels/entities/plan.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Diary extends BasicEntity {
  @Column()
  @IsString()
  img: string;

  @Column()
  @IsString()
  content: string;

  @ManyToOne(() => Plan, (plan) => plan.id, {
    onDelete: 'CASCADE',
  })
  plan: Plan;
  @RelationId((diary: Diary) => diary.plan)
  @IsNumber()
  planId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;
  @RelationId((diary: Diary) => diary.user)
  @IsNumber()
  userId: number;
}
