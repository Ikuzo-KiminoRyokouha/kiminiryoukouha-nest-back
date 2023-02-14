import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
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

  @UseGuards(AccessTokenGuard)
  @Post('/personality')
  async showTravelBySurprise(
    @Body() UpdateTravelBySurpriseInput: ShowTravelBySurpriseInput,
    @Req() req: Request,
  ): Promise<ShowTravelBySurpriseOutput> {
    return await this.destinationService.showTravleDesBySurprise(
      UpdateTravelBySurpriseInput,
      req,
    );
  }
}
