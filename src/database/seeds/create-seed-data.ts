import { Destination } from '../../travels/entities/destination.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import {
  getAllDestinationInfo,
  getDestinationDetail,
} from '../../common/util/destinationInfo';
import axios from 'axios';

export class CreateInitialUserData implements Seeder {
  data;
  setData = [];
  id = 0;
  data2;

  public async run(factory: Factory, connection: Connection): Promise<any> {
    this.setData = [];
    await this.setDestinationInfo(12);
    console.log(this.setData);
    await this.setDestinationInfo(14);
    console.log(this.setData);
    await connection
      .createQueryBuilder()
      .insert()
      .into(Destination)
      .values(this.setData)
      .execute();
  }

  async setDestinationInfo(categoryNum) {
    console.log('0');
    this.data = await getAllDestinationInfo(categoryNum);

    for (let i = 0; i < this.data.length; i++) {
      const data = await getDestinationDetail(
        this.data[i].contentid,
        this.data[i].contenttypeid,
      );
      console.log('');
      console.log('1');
      this.id += 1;
      const { mapx, mapy, title, firstimage } = this.data[i];
      this.setData.push({
        id: this.id,
        cordinationX: mapx,
        cordinationY: mapy,
        name: title,
        img: firstimage,
        overview: data[0].overview,
      });
      console.log('2');
    }
  }
}
