import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ShowTravelBySurpriseInput,
  ShowTravelBySurpriseOutput,
} from '../dtos/destination/show-travel-bySurprise.dto';

import { DestinationService } from '../services/destination.service';

@Controller('destination')
export class DestinationController {
  constructor(private destinationService: DestinationService) {}

  @Get('/detail/:destinationId')
  async showDestinationDetail(@Param('destinationId') destinationId: number) {
    return this.destinationService.showDestinationDetail(destinationId);
  }

  @Get('/tag')
  async showDestinationTag() {
    return this.destinationService.showDestinationTag();
  }

  @Post('/personality')
  async showTravelBySurprise(
    @Body() UpdateTravelBySurpriseInput: ShowTravelBySurpriseInput,
  ): Promise<ShowTravelBySurpriseOutput> {
    return await this.destinationService.showTravleDesBySurprise(
      UpdateTravelBySurpriseInput,
    );
  }
}
