import { IsOptional, IsString } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Travel } from './travel.entity';
import { Album } from './album.entity';

@Entity()
export class Destination extends BasicEntity {
  @Column({ nullable: true })
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

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  firstimage: string;

  @Column({ nullable: true })
  @IsString()
  cat3: string;

  @Column({ nullable: true })
  @IsString()
  contentid: string;

  @Column({ nullable: true })
  @IsString()
  contenttypeid: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Column({ nullable: true })
  @IsString()
  areacode: string;

  @Column({ nullable: true })
  @IsString()
  sigungucode: string;
  @OneToMany(() => Travel, (travel) => travel.plan)
  travels: Travel[];
}
