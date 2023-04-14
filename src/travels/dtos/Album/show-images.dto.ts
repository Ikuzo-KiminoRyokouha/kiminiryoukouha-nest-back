import { BasicOutput } from 'src/common/dtos/output.dto';
import { Album } from 'src/travels/entities/album.entity';

export class ShowImagesOutput extends BasicOutput {
  images?: any;
}

export type DateObject = {
  [date: string]: Array<{
    id: number;
    createdAt: string;
    title: string;
    mapx: null | number;
    mapy: null | number;
    url: string;
  }>;
};
