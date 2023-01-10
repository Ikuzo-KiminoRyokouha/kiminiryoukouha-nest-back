import { IsOptional, IsString } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Destination extends BasicEntity {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  @IsOptional()
  cordinationX: string;

  @Column()
  @IsString()
  @IsOptional()
  cordinationY: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  img: string;

  @Column('text', { nullable: true })
  @IsString()
  @IsOptional()
  overview: string;
}
