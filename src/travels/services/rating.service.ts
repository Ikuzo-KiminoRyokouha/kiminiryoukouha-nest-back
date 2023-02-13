import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { CreateRatingInput } from '../dtos/rating/create-rating.dto';
import { RatingRepository } from '../repositories/rating.respository';

@Injectable()
export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}
  async createRating(
    createRatingInput: CreateRatingInput,
  ): Promise<BasicOutput> {
    try {
      const rating = await this.ratingRepository.createRating(
        createRatingInput,
      );
      if (!rating) throwError;
      return { ok: true, message: 'success to create rating' };
    } catch (error) {
      return { ok: false, message: 'failed to create rating' };
    }
  }
}
