import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { throwError } from 'rxjs';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { CreateRatingInput } from '../dtos/rating/create-rating.dto';
import { RatingRepository } from '../repositories/rating.respository';

@Injectable()
export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}
  async createRating(
    createRatingInput: CreateRatingInput,
    req: Request,
  ): Promise<BasicOutput> {
    try {
      const rating = await this.ratingRepository.createRating(
        createRatingInput,
        req.user['sub'],
      );
      if (!rating) throwError;
      return { ok: true, message: 'success to create rating' };
    } catch (error) {
      return { ok: false, message: 'failed to create rating' };
    }
  }
}
