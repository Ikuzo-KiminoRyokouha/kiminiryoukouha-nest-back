import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { getDestinationInfo } from 'src/common/util/destinationInfo';

import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';

@Injectable()
export class DestinationRepository {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async showDestinationById(destinationId): Promise<Destination | null> {
    try {
      const destination = await this.destinationRepository.findOne({
        where: { id: destinationId },
      });
      if (!destination) return null;
      return destination;
    } catch (error) {
      throws;
    }
  }

  async getRaondomDes(tagArr: string[]): Promise<Destination> {
    try {
      let randomDestination;
      if (tagArr == null) {
        randomDestination = await this.destinationRepository
          .createQueryBuilder('destination')
          .getMany();
      } else {
        randomDestination = await this.destinationRepository
          .createQueryBuilder('destination')
          .where('destination.cat3 IN (:tagArr)', { tagArr })
          .getMany();
      }
      if (randomDestination[0] == null) return null;
      const max = randomDestination.length;
      const ranNum = Math.floor(Math.random() * max) + 1;
      return randomDestination[ranNum - 1];
    } catch (error) {
      throws;
    }
  }
}
