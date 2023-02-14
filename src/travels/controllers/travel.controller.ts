import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { BasicOutput } from '../../common/dtos/output.dto';
import {
  AddRandomTravelInput,
  AddRandomTravelOutput,
} from '../dtos/travel/add-random-travel.dto';
import { UpdateTravelOutput } from '../dtos/travel/update-travel.dto';
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

  @Put('/des/:travelId/:destinationId')
  async updateTravelByDestinationId(
    @Param('travelId') travelId: number,
    @Param('destinationId') destinationId: number,
  ): Promise<UpdateTravelOutput> {
    return await this.travelService.updateTravelByDestinationId(
      travelId,
      destinationId,
    );
  }

  @Put('/des/:travelId')
  async updateTravelDes(
    @Param('travelId') travelId: number,
  ): Promise<BasicOutput> {
    return await this.travelService.updateTravelDes(travelId);
  }

  @Post('/other/random')
  async addRandomTravel(
    @Body() addTravelInput: AddRandomTravelInput,
  ): Promise<AddRandomTravelOutput> {
    return await this.travelService.addRandomTravel(addTravelInput);
  }
}
