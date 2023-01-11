import { IsOptional, IsString } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Destination extends BasicEntity {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  @IsOptional()
  mapx: string;

  @Column()
  @IsString()
  @IsOptional()
  mapy: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  firstimg: string;

  @Column()
  @IsString()
  contentid: string;

  @Column()
  @IsString()
  contenttypeid: string;
}
