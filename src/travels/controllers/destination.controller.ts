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

  @Get('/tag/:areaCode/:sigungu')
  async showDestinationTag(@Param('areaCode')areacode: string,@Param('sigungu')sigungu:string) {
    return this.destinationService.showDestinationTag(areacode,sigungu);
  }
  //뭔가 2개 다 들어갔을때 반환해야하니까 
  //파라미터, 바디에 값이 2개있어야함 

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
