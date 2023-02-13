import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { TravelModule } from './travels/travel.module';
import { Plan } from './travels/entities/plan.entity';
import { BoardModule } from './boards/board.module';

import { Travel } from './travels/entities/travel.entity';
import { Destination } from './travels/entities/destination.entity';
import { ScheduleModule } from '@nestjs/schedule';
import * as ormconfig from '../ormconfig';
import { Rating } from './travels/entities/rating.entity';
import { Board, Comment, Community } from './boards/entities';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
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
      timezone: 'KST',
      //   seeds: ['src/database/seeds/**/*.ts'],
    }),

    UsersModule,
    CommonModule,
    AuthModule,
    TravelModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
