import { IsNumber } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';

import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Destination } from './destination.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Rating extends BasicEntity {
  @ManyToOne(() => User, (user: User) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  @IsNumber()
  userId: number;

  @ManyToOne(() => Destination, (destination: Destination) => destination.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'destinationId' })
  destination: Destination;
  @Column()
  @IsNumber()
  destinationId: number;

  @Column()
  @IsNumber()
  rating: number;
}
