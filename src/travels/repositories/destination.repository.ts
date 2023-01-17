import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import {
  getDestinationDetail,
  getDestinationInfo,
} from 'src/common/util/destinationInfo';

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

  async createDestinationDetail(contentId: string, contentTypeId: string) {
    const detail = await getDestinationDetail(contentId, contentTypeId);
  }

  async showDestinationDetail(destinaitonId: number) {
    try {
      const detail = await this.destinationRepository.findOne({
        where: { id: destinaitonId },
      });
    } catch (error) {}
  }

  async updateDestination(
    destinaitonId,
    destination: Destination,
  ): Promise<Destination> {
    try {
      const updateDestination = await this.destinationRepository.save([
        { id: destinaitonId, ...destination },
      ]);
      return updateDestination[0];
    } catch (error) {
      throws;
    }
  }
}
