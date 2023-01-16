import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';
import { UpdateTravelClearOutput } from '../dtos/travel/update-travel-clear.dto';
import { TravelRepository } from '../repositories/travel.repository';

@Injectable()
export class TravelService {
  constructor(private travelRespository: TravelRepository) {}
  async updateTravelClear(travelId: number): Promise<UpdateTravelClearOutput> {
    try {
      const travel = await this.travelRespository.updateTravelClear(travelId);
      if (travel === null)
        return { ok: false, message: 'cannot find this travel' };
      if (travel === false) throwError;
      return { ok: true, message: 'update travel to clear' };
    } catch (error) {
      return { ok: false, error: 'failed to update travel' };
    }
  }
}
