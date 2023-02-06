import { IsNumber, IsString } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Plan } from '../../travels/entities/plan.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  RelationId,
} from 'typeorm';

@Entity()
export class Community extends BasicEntity {
  @Column({ nullable: true })
  @IsString()
  img: string;

  @Column()
  @IsString()
  content: string;

  @OneToOne(() => Plan, (plan) => plan.id, {
    onDelete: 'CASCADE',
  })
  plan: Plan;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;
}
