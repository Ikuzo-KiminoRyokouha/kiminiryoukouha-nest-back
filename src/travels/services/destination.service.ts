import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import { getDestinationDetail } from '../../util/destinationInfo';
import { ShowDetinationDetail } from '../dtos/destination/show-destination-detail.dto';
import { ShowDestinationCode } from '../dtos/destination/show-destination-tag.dto';
import {
  ShowTravelBySurpriseInput,
  ShowTravelBySurpriseOutput,
} from '../dtos/destination/show-travel-bySurprise.dto';
import { DestinationRepository } from '../repositories/destination.repository';

@Injectable()
export class DestinationService {
  constructor(private destinationRespository: DestinationRepository) {}

  async showDestinationDetail(destinaitonId): Promise<ShowDetinationDetail> {
    const destinaiton = await this.destinationRespository.showDestinationById(
      destinaitonId,
    );
    if (destinaiton.description === null) {
      const description = await getDestinationDetail(
        destinaiton.contentid,
        destinaiton.contenttypeid,
      );
      const updatedDestination =
        await this.destinationRespository.updateDestination(destinaitonId, {
          ...destinaiton,
          description: description.overview,
        });
      return { ok: true, description: updatedDestination.description };
    }
    return { ok: true, description: destinaiton.description };
  }

  async showDestinationTag(): Promise<ShowDestinationCode> {
    try {
      const tags = await this.destinationRespository.showDestinationTag();
      if (!tags[0]) return { ok: false, error: 'not found any tag' };
      return { ok: true, tags };
    } catch (error) {
      return { ok: false, error: 'failed to show tag' };
    }
  }

  async showTravleDesBySurprise(
    { userId, planId, tag, count }: ShowTravelBySurpriseInput,
    req: Request,
  ): Promise<ShowTravelBySurpriseOutput> {
    try {
      const rawItem = await axios
        .post(process.env.DJANGO_API + 'destinations', {
          data: { userId, tag, start: (count - 1) * 5, end: count * 5 },
        })
        .then((res) => {
          return res.data;
        });
      const splitItem = rawItem.split(')(');
      const personalizedDestination = splitItem.map((item) => {
        const newItem = item.replace(/[()]/g, '').split(',');
        return [parseInt(newItem[0]), parseFloat(newItem[1])];
      });
      return {
        ok: true,
        destination: personalizedDestination,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'can not show travel',
      };
    }
  }
}
