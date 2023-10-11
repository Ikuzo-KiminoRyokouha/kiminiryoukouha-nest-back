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

  async createImate({ planId, destinationId, url, title, mapx, mapy }) {
    const image = await this.albumRepository.save(
      this.albumRepository.create({
        planId,
        destinationId,
        url,
        mapx,
        mapy,
        title,
      }),
    );
    return image;
  }

  async showAlbumByPlanId(planId) {
    const album = await this.albumRepository.find({
      where: { planId },
      select: ['id', 'title', 'mapx', 'mapy', 'url', 'createdAt'],
      order: {
        createdAt: 'ASC',
      },
    });

    return album;
  }

  async showAlbumsByUserId(userId) {
    const albums = await this.albumRepository
      .createQueryBuilder('album')
      .select(['album.id', 'album.planId'])
      .leftJoin('album.plan', 'plan')
      .groupBy('planId')

      .where('plan.userId = :userId', { userId })
      .getMany();

    return albums;
  }
}
