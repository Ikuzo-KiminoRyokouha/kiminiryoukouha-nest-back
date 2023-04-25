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

  async showDestinationTag(areacode, sigungu): Promise<ShowDestinationCode> {
    //얘가 plan/new step2번쨰에서 불려지는 태그들
    try {
      const tags = await this.destinationRespository.showDestinationTag(
        areacode,
        sigungu,
      );
      if (!tags[0]) return { ok: false, error: 'not found any tag' };
      return { ok: true, tags };
    } catch (error) {
      return { ok: false, error: 'failed to show tag' };
    }
  }

  async showTravleDesBySurprise(
    { planId, tag, count }: ShowTravelBySurpriseInput,
    req: Request,
  ): Promise<ShowTravelBySurpriseOutput> {
    try {
      const rawItem = await axios
        .post(process.env.DJANGO_API + 'destinations', {
          data: {
            userId: req.user['sub'],
            tag,
            start: (count - 1) * 5,
            end: count * 5,
          },
        })
        .then((res) => {
          return res.data;
        });
      const splitItem = rawItem.split(')(');
      console.log(splitItem);
      const newDesArr = [];
      for (let i = 0; i < splitItem.length; i++) {
        const item = splitItem[i];
        const newItem = item.replace(/[()]/g, '').split(',');
        const newDes = await this.destinationRespository.showDestinationById(
          parseInt(newItem[0]),
        );
        newDesArr.push([newDes, parseFloat(newItem[1])]);
      }
      // const personalizedDestination = splitItem.map(async (item) => {
      //   const newItem = item.replace(/[()]/g, '').split(',');
      //   const newDes = await this.destinationRespository.showDestinationById(
      //     parseInt(newItem[0]),
      //   );
      //   return [newDes, parseFloat(newItem[1])];
      // });
      return {
        ok: true,
        destination: newDesArr,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'can not show travel',
      };
    }
  }
}
