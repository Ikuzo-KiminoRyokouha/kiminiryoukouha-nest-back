import { IsString } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Plan } from './plan.entity';

@Entity()
export class Diary extends BasicEntity {
  @Column()
  @IsString()
  img: string;

  @Column()
  @IsString()
  content: string;

  @ManyToOne(() => Plan, (plan) => plan.id)
  plan: number;
}
