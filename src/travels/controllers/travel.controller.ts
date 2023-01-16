import { Controller, Get, Param, Put } from '@nestjs/common';
import { TravelService } from '../services/travel.service';

@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}
  @Put('/:travelId')
  async updateTravelClear(@Param('travelId') travelId: number) {
    return await this.travelService.updateTravelClear(travelId);
  }
}
