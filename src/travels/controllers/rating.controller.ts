import { Body, Controller, Post } from '@nestjs/common';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { CreateRatingInput } from '../dtos/rating/create-rating.dto';
import { RatingService } from '../services/rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async createRating(
    @Body() createRatingInput: CreateRatingInput,
  ): Promise<BasicOutput> {
    return this.ratingService.createRating(createRatingInput);
  }
}
