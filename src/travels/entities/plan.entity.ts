import {
  IsArray,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { Travel } from './travel.entity';

@Entity()
export class Plan extends BasicEntity {
  @Column()
  @IsString()
  @IsOptional()
  title: string;

  @Column({ type: 'json', nullable: true })
  @IsObject()
  @IsOptional()
  tag: object;

  @Column()
  @IsDateString()
  start: Date;

  @Column()
  @IsDateString()
  end: Date;

  @Column()
  @IsString()
  city: string;

  @Column({ type: 'json', nullable: true })
  @IsObject()
  @IsOptional()
  destination: object;

  @Column({ type: 'json', nullable: true })
  @IsObject()
  @IsOptional()
  img: object;

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  totalCost: number;

  @Column({ type: 'json', nullable: true })
  @IsObject()
  @IsOptional()
  dayPerCost: object;

  @OneToMany(() => Travel, (travel) => travel.plan, {
    cascade: ['remove', 'soft-remove', 'recover'],
  })
  travels: Travel[];

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  @IsNumber()
  userId: number;
}
