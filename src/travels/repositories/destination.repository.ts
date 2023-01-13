import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getDestinationInfo } from 'src/common/util/destinationInfo';

import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';

@Injectable()
export class DestinationRepository {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async createDestination(destinationName) {
    try {
      //좌표 구하거나 받아서 하기
      const searchedDes = await getDestinationInfo(destinationName);
      console.log(searchedDes);

      const { mapx, mapy, firstimage, contentid, contenttypeid, title } =
        searchedDes;
      // const destination = await this.destinationRepository.save(
      //   this.destinationRepository.create({
      //     title,
      //     mapx,
      //     mapy,
      //     firstimage,
      //     contentid,
      //     contenttypeid,
      //   }),
      // );
      // console.log(destination);
      // return destination;
    } catch (error) {
      return null;
    }
  }

  async checkDestination(destinationName) {
    try {
      let destination = await this.destinationRepository.findOne({
        where: { title: destinationName },
      });
      if (!destination)
        destination = await this.createDestination(destinationName);
      return destination;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async showDestination(destinationNmae) {
    try {
      const destination = await this.destinationRepository.findOne({
        where: { title: destinationNmae },
      });
      if (!destination) return null;
      return destination;
    } catch (error) {
      return null;
    }
  }

  async getRaondomDes(tagArr: string[]) {
    try {
      const randomDestination = await this.destinationRepository
        .createQueryBuilder('destination')
        .where('destination.cat3 IN (:tagArr)', { tagArr })
        .getMany();
      const max = randomDestination.length;
      const ranNum = Math.floor(Math.random() * max) + 1;
      return randomDestination[ranNum];
    } catch (error) {
      return null;
    }
  }

  async getCountDes() {
    const countAll = await this.destinationRepository.count();
    return countAll;
  }
}
