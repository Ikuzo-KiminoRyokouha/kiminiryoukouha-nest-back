import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Board, Comment, Diary, Community } from 'src/boards/entities';
import { Destination } from 'src/travels/entities/destination.entity';
import { Plan } from 'src/travels/entities/plan.entity';
import { Travel } from 'src/travels/entities/travel.entity';
import { User } from 'src/users/entities/user.entity';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'prod',
  // synchronize: true,
  logging: true,
  entities: [User, Plan, Diary, Board, Comment, Travel, Destination, Community],
};

export = config;
