import { IsNumber, IsString } from 'class-validator';
import { BasicEntity } from 'src/common/entities/basic.entity';
import { Plan } from 'src/travels/entities/plan.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToOne, RelationId } from 'typeorm';

@Entity()
export class Community extends BasicEntity {
  @Column({ nullable: true })
  @IsString()
  img: string;

  @Column()
  @IsString()
  content: string;

  @ManyToOne(() => Plan, (plan) => plan.id, {
    onDelete: 'CASCADE',
  })
  plan: Plan;
  @RelationId((community: Community) => community.plan)
  @IsNumber()
  planId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;
  @RelationId((community: Community) => community.user)
  @IsNumber()
  userId: number;
}
