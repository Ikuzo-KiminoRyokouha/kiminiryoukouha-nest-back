import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { UpdateTravelClearOutput } from '../dtos/travel/update-travel-clear.dto';
import { DestinationRepository } from '../repositories/destination.repository';
import { TravelRepository } from '../repositories/travel.repository';

@Injectable()
export class TravelService {
  constructor(
    private travelRespository: TravelRepository,
    private destinaitonRespoeitory: DestinationRepository,
  ) {}
  async updateTravelClear(travelId: number): Promise<UpdateTravelClearOutput> {
    try {
      const travel = await this.travelRespository.showTravel(travelId);
      if (!travel) return { ok: false, message: 'cannot find this travel' };

      await this.travelRespository.updateTravel(travelId, {
        ...travel,
        clear: !travel.clear,
      });
      return { ok: true, message: 'update travel to clear' };
    } catch (error) {
      return { ok: false, error: 'failed to update travel' };
    }
  }

  async updateTravelDes(travelId: number): Promise<BasicOutput> {
    try {
      const travel = await this.travelRespository.showTravel(travelId);
      if (!travel) return { ok: false, message: 'cannot find this travel' };
      console.log('travel', travel);
      const destination = await this.destinaitonRespoeitory.showDestinationById(
        travel.destinationId,
      );
      const updateDestination = await this.destinaitonRespoeitory.getRaondomDes(
        [destination.cat3],
      );
      const updateTravel = await this.travelRespository.updateTravel(travelId, {
        ...travel,
        destination: updateDestination,
      });
      if (!updateTravel) throwError;
      return { ok: true, message: 'update travel' };
    } catch (error) {
      return { ok: false, error: 'failed to update travel' };
    }
  }
}
