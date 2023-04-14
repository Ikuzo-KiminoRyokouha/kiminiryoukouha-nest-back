import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BasicEntity } from 'src/common/entities/basic.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Plan } from './plan.entity';

@Entity()
export class Album extends BasicEntity {
  @Column()
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  mapx: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  mapy: string;

  @Column()
  @IsString()
  url: string;

  @ManyToOne(() => Plan, (plan) => plan.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'planId' })
  plan: Plan;
  @Column()
  @IsNumber()
  planId: number;
}
