import { Destination } from '../../travels/entities/destination.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import {
  getAllDestinationInfo,
  getDestinationDetail,
} from '../../common/util/destinationInfo';
import axios from 'axios';

export class CreateInitialUserData implements Seeder {
  data: [object];
  data2: [object];
  setData;
  public async run(factory: Factory, connection: Connection): Promise<any> {
    this.data = await getAllDestinationInfo(12);
    this.data2 = await getAllDestinationInfo(14);
    this.setData = this.data.concat(this.data2);
    console.log(this.setData);
    await connection
      .createQueryBuilder()
      .insert()
      .into(Destination)
      .values(this.setData)
      .execute();
  }
}
