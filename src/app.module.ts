import * as dotenv from 'dotenv';
dotenv.config();

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
import { Rating } from './travels/entities/rating.entity';
import { Board, Comment, Community } from './boards/entities';
import { AppController } from './app.controller';
import { dataSourceOptions } from './database/ormconfig';
import { ormConfig } from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      // ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),

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
