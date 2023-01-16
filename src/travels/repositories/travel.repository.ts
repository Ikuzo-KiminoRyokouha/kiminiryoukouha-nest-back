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

  async showTravel(travelId: number) {
    try {
      const travel = await this.travelRepository.findOne({
        where: { id: travelId },
      });
      return travel;
    } catch (error) {
      return false;
    }
  }
  async creatTravel(createTravelInput) {
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
      return null;
    }
  }

  async updateTravelClear(travelId: number): Promise<Travel[] | null | false> {
    try {
      const travel = await this.showTravel(travelId);
      if (!travel) return null;
      const updateTravel = await this.travelRepository.save([
        { id: travelId, clear: !travel.clear },
      ]);
      return updateTravel;
    } catch (error) {
      return false;
    }
  }
}
