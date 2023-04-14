import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../entities/album.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumRepository {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async createImate({ planId, url, title }) {
    const image = await this.albumRepository.save(
      this.albumRepository.create({
        planId,
        url,
        title,
      }),
    );
    return image;
  }

  async showAlbumByPlanId(planId) {
    const album = await this.albumRepository.find({
      where: planId,
      select: ['id', 'title', 'mapx', 'mapy', 'url', 'createdAt'],
      order: {
        createdAt: 'ASC',
      },
    });

    return album;
  }
}
