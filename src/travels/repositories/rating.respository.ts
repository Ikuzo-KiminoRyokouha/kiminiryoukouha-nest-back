import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateRatingInput } from '../dtos/rating/create-rating.dto';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class RatingRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}
  async createRating(createRatingInput: CreateRatingInput, userId) {
    try {
      const rating = await this.ratingRepository.save(
        this.ratingRepository.create({
          ...createRatingInput,
          userId,
        }),
      );
      return rating;
    } catch (error) {
      return throwError;
    }
  }

  async showRatingByUserId(userId: number) {
    try {
      const ratings = await this.ratingRepository.find({ where: { userId } });
      return ratings;
    } catch (error) {
      return throwError;
    }
  }
}
