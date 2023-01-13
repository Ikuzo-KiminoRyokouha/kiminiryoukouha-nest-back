import { IsBoolean, IsNumber } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Destination } from './destination.entity';
import { Plan } from './plan.entity';

@Entity()
export class Travel extends BasicEntity {
  @Column()
  @IsNumber()
  startDay: Date;

  @Column({ default: false })
  @IsBoolean()
  clear: boolean;

  @ManyToOne(() => Plan, (plan) => plan.id)
  plan: Plan;
  @RelationId((travel: Travel) => travel.plan)
  @IsNumber()
  planId: number;

  @ManyToOne(() => Destination, (destination) => destination.id)
  destination: Destination;
  @RelationId((travel: Travel) => travel.destination)
  @IsNumber()
  destinationId: number;
}
