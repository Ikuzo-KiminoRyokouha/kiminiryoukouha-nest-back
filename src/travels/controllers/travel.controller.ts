import { Controller, Get, Param, Put } from '@nestjs/common';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { TravelService } from '../services/travel.service';

@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}
  @Put('/clear/:travelId')
  async updateTravelClear(
    @Param('travelId') travelId: number,
  ): Promise<BasicOutput> {
    return await this.travelService.updateTravelClear(travelId);
  }

  @Put('/des/:travelId')
  async updateTravelDes(
    @Param('travelId') travelId: number,
  ): Promise<BasicOutput> {
    return await this.travelService.updateTravelDes(travelId);
  }
}
