import { Injectable } from '@nestjs/common';
import { getDestinationDetail } from 'src/common/util/destinationInfo';
import { ShowDetinationDetail } from '../dtos/destination/show-destination-detail.dto';
import { ShowDestinationCode } from '../dtos/destination/show-destination-tag.dto';
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
}
