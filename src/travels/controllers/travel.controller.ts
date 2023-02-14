import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  AddRandomTravelInput,
  AddRandomTravelOutput,
} from '../dtos/travel/add-random-travel.dto';
import { AddTraveOutPut } from '../dtos/travel/add-travel.dto';
import { UpdateTravelOutput } from '../dtos/travel/update-travel.dto';
import { TravelService } from '../services/travel.service';

@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @UseGuards(AccessTokenGuard)
  @Put('/clear/:travelId')
  async updateTravelClear(
    @Param('travelId') travelId: number,
    @Req() req: Request,
  ): Promise<BasicOutput> {
    return await this.travelService.updateTravelClear(travelId, req);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/des/:travelId/:destinationId')
  async updateTravelByDestinationId(
    @Param('travelId') travelId: number,
    @Param('destinationId') destinationId: number,
    @Req() req: Request,
  ): Promise<UpdateTravelOutput> {
    return await this.travelService.updateTravelByDestinationId(
      travelId,
      destinationId,
      req,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Put('/des/:travelId')
  async updateTravelRandomDes(
    @Param('travelId') travelId: number,
    @Req() req: Request,
  ): Promise<BasicOutput> {
    return await this.travelService.updateTravelRandomDes(travelId, req);
  }

  @UseGuards(AccessTokenGuard)
  @Post('des/:planId/:destinationId')
  async addTravelByDestinationId(
    @Param('planId') planId: number,
    @Param('destinationId') destinationId: number,
    @Req() req: Request,
  ): Promise<AddTraveOutPut> {
    return await this.travelService.addTravelByDestinationId(
      planId,
      destinationId,
      req,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('/other/random')
  async addRandomTravel(
    @Body() addTravelInput: AddRandomTravelInput,
    @Req() req: Request,
  ): Promise<AddRandomTravelOutput> {
    return await this.travelService.addRandomTravel(addTravelInput, req);
  }
}
