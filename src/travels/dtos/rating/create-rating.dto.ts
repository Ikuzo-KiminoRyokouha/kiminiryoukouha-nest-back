import { IsNumber, Max, Min } from 'class-validator';

export class CreateRatingInput {
  @Min(0)
  @Max(5)
  rating: number;

  @IsNumber()
  destinationId: number;
}
