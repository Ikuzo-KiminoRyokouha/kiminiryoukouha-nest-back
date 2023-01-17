import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';
import { Travel } from '../entities/travel.entity';

@Injectable()
export class TravelRepository {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
  ) {}

  async showTravel(travelId: number): Promise<Travel | null> {
    try {
      const travel = await this.travelRepository.findOne({
        where: { id: travelId },
      });
      if (!travel) return null;
      return travel;
    } catch (error) {
      throws;
    }
  }

  async creatTravel(createTravelInput): Promise<Travel[]> {
    try {
      const travel = await this.travelRepository.save(
        this.travelRepository.create({
          ...createTravelInput,
          plan: createTravelInput.planId,
          destination: createTravelInput.destinationId,
        }),
      );
      return travel;
    } catch (error) {
      throws;
    }
  }

  async updateTravel(
    travelId: number,
    updateTravelInput: Travel,
  ): Promise<Travel[]> {
    try {
      const travel = await this.travelRepository.save([
        { id: travelId, ...updateTravelInput },
      ]);
      return travel;
    } catch (error) {
      throws;
    }
  }
}
