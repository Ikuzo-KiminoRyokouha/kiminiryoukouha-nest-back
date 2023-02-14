import { Destination } from '../../travels/entities/destination.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import {
  getAllDestinationInfo,
  getDestinationDetail,
} from '../../util/destinationInfo';
// import faker from '@faker-js/faker';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../users/entities/user.entity';
import { Rating } from '../../travels/entities/rating.entity';

export class CreateInitialUserData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const destination1 = await getAllDestinationInfo(12);
    const destination2 = await getAllDestinationInfo(14);
    const setData = destination1.concat(destination2);
    await connection
      .createQueryBuilder()
      .insert()
      .into(Destination)
      .values(setData)
      .execute();

    const userData = [];
    for (let i = 1; i <= 100; i++) {
      const password = await bcrypt.hash('111111', 10);
      userData.push({
        email: `${faker.internet.email()}`,
        password,
        nickname: `${faker.name.fullName()}`,
        role: UserRole.Client,
      });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(userData)
      .execute();
    const usersRating = [];
    for (let i = 0; i < userData.length; i++) {
      for (let j = 0; j < setData.length; j++) {
        const check = Math.floor(Math.random() * 20) + 1;
        if (check == 2) {
          const rating = Math.floor(Math.random() * 5);
          usersRating.push({
            rating,
            userId: i + 1,
            destinationId: j + 1,
          });
        }
      }
    }
    console.log(usersRating);

    await connection
      .createQueryBuilder()
      .insert()
      .into(Rating)
      .values(usersRating)
      .execute();
  }
}
