import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRatingTable1644915901945 implements MigrationInterface {
  name = 'CreateRatingTable1644915901945';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rating" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "destinationId" integer NOT NULL, "rating" numeric NOT NULL, CONSTRAINT "PK_38f8b49c9dfb22ab7c2d1a8a7d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ADD CONSTRAINT "FK_562ec96e9605d5c5f60135e7f68" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ADD CONSTRAINT "FK_250d55f7dabf725af012b7d17c6" FOREIGN KEY ("destinationId") REFERENCES "destination"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rating" DROP CONSTRAINT "FK_250d55f7dabf725af012b7d17c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" DROP CONSTRAINT "FK_562ec96e9605d5c5f60135e7f68"`,
    );
    await queryRunner.query(`DROP TABLE "rating"`);
  }
}
