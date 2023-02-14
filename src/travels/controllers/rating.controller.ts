import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { BasicOutput } from '../../common/dtos/output.dto';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { CreateRatingInput } from '../dtos/rating/create-rating.dto';
import { RatingService } from '../services/rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async createRating(
    @Body() createRatingInput: CreateRatingInput,
    @Req() req: Request,
  ): Promise<BasicOutput> {
    return this.ratingService.createRating(createRatingInput, req);
  }
}
