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

      const { mapx, mapy, firstimage } = searchedDes;
      const destination = await this.destinationRepository.save(
        this.destinationRepository.create({
          name: destinationName,
          cordinationX: mapx,
          cordinationY: mapy,
          img: firstimage,
        }),
      );
      console.log(destination);
      return destination;
    } catch (error) {
      return null;
    }
  }

  async checkDestination(destinationName) {
    try {
      let destination = await this.destinationRepository.findOne({
        where: { name: destinationName },
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
        where: { name: destinationNmae },
      });
      if (!destination) return null;
      return destination;
    } catch (error) {
      return null;
    }
  }
}
