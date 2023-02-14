import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDestinationTable1644917911003 implements MigrationInterface {
  name = 'createDestinationTable1644917911003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "destination" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "mapx" character varying, "mapy" character varying, "firstimage" character varying, "cat3" character varying NOT NULL, "contentid" character varying NOT NULL, "contenttypeid" character varying NOT NULL, "description" text, CONSTRAINT "PK_d3acde522678b601d9e2a71c154" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "travel" ADD "destinationId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "destination" ADD CONSTRAINT "FK_811b2f3b3c37b576f9e24038f46" FOREIGN KEY ("destinationId") REFERENCES "destination"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "destination" DROP CONSTRAINT "FK_811b2f3b3c37b576f9e24038f46"`,
    );
    await queryRunner.query(`ALTER TABLE "travel" DROP COLUMN "destinationId"`);
    await queryRunner.query(`DROP TABLE "destination"`);
  }
}
