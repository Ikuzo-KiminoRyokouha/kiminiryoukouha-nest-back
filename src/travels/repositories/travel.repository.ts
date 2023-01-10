import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Travel } from '../entities/travel.entity';

@Injectable()
export class TravelRepository {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
  ) {}

  async creatTravel(createTravelInput) {
    try {
      console.log(createTravelInput);
      const travel = await this.travelRepository.save(
        this.travelRepository.create({
          ...createTravelInput,
          plan: createTravelInput.planId,
          destination: createTravelInput.destinationId,
        }),
      );
      return travel;
    } catch (error) {
      return null;
    }
  }
}
