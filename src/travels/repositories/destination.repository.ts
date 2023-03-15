import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import {
  getDestinationDetail,
  getDestinationInfo,
} from '../../util/destinationInfo';

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

  async getRaondomDes(tagArr: string[], checkDes): Promise<Destination> {
    try {
      let randomDestination;
      if (tagArr == null) {
        randomDestination = await this.destinationRepository
          .createQueryBuilder('destination')
          .where('destination.id NOT IN (:checkDes)', { checkDes })
          .getMany();
      } else {
        randomDestination = await this.destinationRepository
          .createQueryBuilder('destination')
          .where('destination.cat3 IN (:tagArr)', { tagArr })
          .andWhere('destination.id NOT IN (:checkDes)', { checkDes })
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

  async getRaondomDes1(checkarea,tagArr: string[], checkDes): Promise<Destination> {
    try {
      let randomDestination;
      if (tagArr == null) {
        randomDestination = await this.destinationRepository
          .createQueryBuilder('destination')
          .where('destination.id NOT IN (:checkDes)', { checkDes })
          .andWhere(`destination.areacode = ${checkarea.areacode}`)
          .andWhere(`destination.sigungucode = ${checkarea.sigungucode}`)
         
          .getMany();
      } else {
        randomDestination = await this.destinationRepository
          .createQueryBuilder('destination')
          .where('destination.cat3 IN (:tagArr)', { tagArr })
          .andWhere(`destination.areacode = ${checkarea.areacode}`)
          .andWhere(`destination.sigungucode = ${checkarea.sigungucode}`)
          .andWhere('destination.id NOT IN (:checkDes)', { checkDes })
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






  // async duplicateDestinationCheck(chedkedItem, destinaiton) { 일단내가한거아님
  //   try {
  //     const check =
  //   } catch (error) {
  //     throws;
  //   }
  // }

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

  async showDestinationTag(areacode,sigungu) {
    try {
      const tag = await this.destinationRepository
        .createQueryBuilder('destination') //데이터베이스에서 destination테이블에서 
        .select('destination.cat3 AS tag ') //바다,산 
        .where(`destination.areacode = ${areacode}`)
        .andWhere(`destination.sigungucode = ${sigungu}`)
        .addSelect('COUNT(*) AS tagCount')//개수 
        .groupBy('destination.cat3')
        .getRawMany();
      return tag;
    } catch (error) {
      throws;
    }
  }
}
