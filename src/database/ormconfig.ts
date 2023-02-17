import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Board, Comment, Community } from '../boards/entities';
import { Destination } from '../travels/entities/destination.entity';
import { Plan } from '../travels/entities/plan.entity';
import { Travel } from '../travels/entities/travel.entity';
import { User } from '../users/entities/user.entity';
import { Rating } from '../travels/entities/rating.entity';
import { DataSourceOptions } from 'typeorm';

export const ormOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'prod',
  // synchronize: true,
  logging: true,
  entities: [
    User,
    Plan,
    Board,
    Comment,
    Travel,
    Destination,
    Rating,
    Community,
  ],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  timezone: 'KST',
  migrationsRun: true,
  //   seeds: ['src/database/seeds/**/*.ts'],
};
