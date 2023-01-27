import { IsBoolean, IsNumber } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
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

  @ManyToOne(() => Plan, (plan) => plan.id, {
    onDelete: 'CASCADE',
  })
  plan: Plan;
  @RelationId((travel: Travel) => travel.plan)
  @IsNumber()
  planId: number;

  @ManyToOne(() => Destination, (destination) => destination.id, {
    onDelete: 'CASCADE',
  })
  destination: Destination;
  @RelationId((travel: Travel) => travel.destination)
  @IsNumber()
  destinationId: number;
}
