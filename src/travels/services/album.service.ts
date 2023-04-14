import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { UserRespository } from 'src/users/repositories/users.repository';
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
    createImageInput: CreateImageInput,
    file: Express.Multer.File,
  ) {
    try {
      const plan = await this.planRepository.showPlan(createImageInput.planId);

      if (!file) return { ok: false, message: 'not found any image' };
      if (!plan) return { ok: false, message: 'not found any plan' };

      const ext = path.extname(file.originalname);
      const url = `${path.basename(file.originalname, ext) + Date.now() + ext}`;
      url.replace(/:/g, '-');
      console.log(url);
      fs.writeFileSync(`public/img/${url}`, file.buffer);
      console.log(!createImageInput.titile);
      if (!createImageInput.titile) {
        createImageInput.titile = plan.city + '여행';
      }
      const image = await this.albumRepository.createImate({
        planId: createImageInput.planId,
        title: createImageInput.titile,
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

  async showAlbum(planId, userId): Promise<ShowImagesOutput> {
    try {
      const plan = await this.planRepository.showPlan(planId);
      if (!plan) return { ok: false, message: 'check your planid' };
      if (plan.userId != userId)
        return { ok: false, message: 'you cannot access this images' };
      const tempImages = await this.albumRepository.showAlbumByPlanId(planId);
      const images = {};
      tempImages.forEach((item) => {
        const date = new Date(item.createdAt).toDateString(); // 날짜만 추출
        if (!images[date]) {
          images[date] = [item]; // 해당 날짜에 해당하는 배열이 없다면 새로 생성
        } else {
          images[date].push(item); // 이미 해당 날짜에 해당하는 배열이 있다면 해당 배열에 추가
        }
      });
      Object.keys(images).forEach((key) =>
        console.log(key, ' : ', images[key]),
      );
      // if (images[0] == null)
      //   return { ok: false, message: 'not found any image' };
      return { ok: true, images };
    } catch (error) {
      console.log(error);
      return { ok: false, message: 'failed to show images' };
    }
  }
}
