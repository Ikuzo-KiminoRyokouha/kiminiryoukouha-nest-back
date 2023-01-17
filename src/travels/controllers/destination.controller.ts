import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { DestinationService } from '../services/destination.service';

@Controller('destination')
export class DestinationController {
  constructor(private destinationService: DestinationService) {}

  @Get('/detail/:destinationId')
  async createDestinationDetail(@Param('destinationId') destinationId: number) {
    return this.destinationService.showDestinationDetail(destinationId);
  }
}
