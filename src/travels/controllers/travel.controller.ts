import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { BasicOutput } from 'src/common/dtos/output.dto';
import {
  AddRandomTravelInput,
  AddRandomTravelOutput,
} from '../dtos/travel/add-random-travel.dto';
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

  @Post('/other/random')
  async addTravel(
    @Body() addTravelInput: AddRandomTravelInput,
  ): Promise<AddRandomTravelOutput> {
    return await this.travelService.addRandomTravel(addTravelInput);
  }
}
