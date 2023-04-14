import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/repositories/custom-repository.module';
import { UserRespository } from 'src/users/repositories/users.repository';

import { DestinationController } from './controllers/destination.controller';
import { PlanController } from './controllers/plan.controller';
import { TravelController } from './controllers/travel.controller';
import { Destination } from './entities/destination.entity';
import { Plan } from './entities/plan.entity';
import { Rating } from './entities/rating.entity';
import { Travel } from './entities/travel.entity';
import { DestinationRepository } from './repositories/destination.repository';
import { planRepository } from './repositories/plan.repository';
import { RatingRepository } from './repositories/rating.respository';
import { TravelRepository } from './repositories/travel.repository';
import { DestinationService } from './services/destination.service';
import { PlanService } from './services/plan.service';
import { TravelService } from './services/travel.service';
import { User } from '../users/entities/user.entity';
import { RatingService } from './services/rating.service';
import { RatingController } from './controllers/rating.controller';
import { BankingController } from './controllers/banking.controller';
import { BankingService } from './services/banking.service';
import { BankingToken } from './entities/bankingToken.entity';
import { BankingRepository } from './repositories/banking.respository';
import { Account } from './entities/account.entity';
import { AccountRepository } from './repositories/account.respository';
import { AlbumController } from './controllers/album.controller';
import { AlbumService } from './services/album.service';
import { AlbumRepository } from './repositories/album.repository';
import { Album } from './entities/album.entity';
// import { TestController } from './controllers/test.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan,
      Destination,
      Travel,
      Rating,
      User,
      BankingToken,
      Account,
      Album,
    ]),
    TypeOrmExModule.forCustomRepository([UserRespository]),
  ],
  controllers: [
    TravelController,
    PlanController,
    DestinationController,
    RatingController,
    BankingController,
    AlbumController,
    // TestController,
  ],
  providers: [
    TravelService,
    PlanService,
    DestinationService,
    planRepository,
    DestinationRepository,
    TravelRepository,
    RatingRepository,
    RatingService,
    BankingService,
    BankingRepository,
    AccountRepository,
    AlbumService,
    AlbumRepository,
  ],
})
export class TravelModule {}
