import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomRepository } from 'src/repositories/custom-repository.decorater';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class RatingRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}
  async create(createRatingInput) {
    try {
      const rating = await this.ratingRepository.save({ ...createRatingInput });
    } catch (error) {
      console.log(error);
    }
  }
}
