import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { planRepository } from '../repositories/plan.repository';
import path from 'path';
import { AlbumRepository } from '../repositories/album.repository';
import { CreateImageInput } from '../dtos/Album/create-image.dto';
import { title } from 'process';
import { ShowImagesOutput } from '../dtos/Album/show-images.dto';

@Injectable()
export class AlbumService {
  constructor(
    private planRepository: planRepository,
    private albumRepository: AlbumRepository,
  ) {}

  async createImage(
    { mapx, mapy, planId, destinationId, titile }: CreateImageInput,
    file: Express.Multer.File,
  ) {
    try {
      const plan = await this.planRepository.showPlan(planId);
      if (!file) return { ok: false, message: 'not found any image' };
      if (!plan) return { ok: false, message: 'not found any plan' };

      const ext = path.extname(file.originalname);
      const url = `${path.basename(file.originalname, ext) + Date.now() + ext}`;
      url.replace(/:/g, '-');
      fs.writeFileSync(`public/img/${url}`, file.buffer);
      if (!titile) {
        titile = plan.city + '여행';
      }
      if (destinationId == '0') {
        destinationId = null;
      }
      const image = await this.albumRepository.createImate({
        planId,
        destinationId,
        title,
        mapx,
        mapy,
        url: 'http://localhost:8000/public/img/' + url,
      });
      if (!image) return { ok: false, message: 'failed to create image' };
      return {
        ok: true,
        message: 'successed to create image',
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: 'failed to create image',
      };
    }
  }

  async showAlbums(userId) {
    const albums = await this.albumRepository.showAlbumsByUserId(userId);
    console.log(albums);
  }

  async showAlbum(planId, userId): Promise<ShowImagesOutput> {
    try {
      const plan = await this.planRepository.showPlan(planId);
      if (!plan) return { ok: false, message: 'check your planid' };
      if (plan.userId != userId)
        return { ok: false, message: 'you cannot access this images' };
      const tempImages = await this.albumRepository.showAlbumByPlanId(planId);
      const images = {};
      tempImages.forEach((item) => {
        let date = new Date(item.createdAt).toISOString().slice(0, 10); // 날짜만 추출

        if (!images[date]) {
          images[date] = [item]; // 해당 날짜에 해당하는 배열이 없다면 새로 생성
        } else {
          images[date].push(item); // 이미 해당 날짜에 해당하는 배열이 있다면 해당 배열에 추가
        }
      });

      if (images == null) return { ok: false, message: 'not found any image' };
      return { ok: true, images };
    } catch (error) {
      console.log(error);
      return { ok: false, message: 'failed to show images' };
    }
  }
}
