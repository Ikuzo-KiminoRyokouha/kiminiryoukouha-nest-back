import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
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

  @Column('decimal', { precision: 6, scale: 5, nullable: true })
  @IsOptional()
  @IsNumber()
  exrating: number;

  @ManyToOne(() => Plan, (plan) => plan.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'planId' })
  plan: Plan;
  @Column()
  @IsNumber()
  planId: number;

  @ManyToOne(() => Destination, (destination) => destination.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'destinationId' })
  destination: Destination;
  @Column()
  @IsNumber()
  destinationId: number;
}
