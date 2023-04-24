import { IsOptional, IsString } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Travel } from './travel.entity';
import { Album } from './album.entity';

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
  firstimage: string;

  @Column()
  @IsString()
  cat3: string;

  @Column()
  @IsString()
  contentid: string;

  @Column()
  @IsString()
  contenttypeid: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Column()
  @IsString()
  areacode: string;

  @Column()
  @IsString()
  sigungucode: string;
  @OneToMany(() => Travel, (travel) => travel.plan)
  travels: Travel[];
}
