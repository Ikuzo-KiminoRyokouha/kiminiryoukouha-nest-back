import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlanTable1644893213567 implements MigrationInterface {
  name = 'CreatePlanTable1644893213567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plan" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "tag" json, "start" TIMESTAMP NOT NULL, "end" TIMESTAMP NOT NULL, "city" character varying NOT NULL, "destination" json, "img" json, "totalCost" integer, "dayPerCost" json, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2230f9a22c157d7e6ff9f3a3bd6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan" ADD CONSTRAINT "FK_2b8c3f1a315b61c27a23beaf80e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `CREATE TABLE "plan_travels_travel" ("planId" integer NOT NULL, "travelId" integer NOT NULL, CONSTRAINT "PK_c9370cbb73826e399d3c7bde9ab" PRIMARY KEY ("planId", "travelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f33f11fdd7ad4e8184a4c9ac3f" ON "plan_travels_travel" ("planId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2f9a63a73b2153b6de3d6c1b77" ON "plan_travels_travel" ("travelId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_travels_travel" ADD CONSTRAINT "FK_f33f11fdd7ad4e8184a4c9ac3f1" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_travels_travel" ADD CONSTRAINT "FK_2f9a63a73b2153b6de3d6c1b771" FOREIGN KEY ("travelId") REFERENCES "travel"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plan_travels_travel" DROP CONSTRAINT "FK_2f9a63a73b2153b6de3d6c1b771"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_travels_travel" DROP CONSTRAINT "FK_f33f11fdd7ad4e8184a4c9ac3f1"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_2f9a63a73b2153b6de3d6c1b77"`);
    await queryRunner.query(`DROP INDEX "IDX_f33f11fdd7ad4e8184a4c9ac3f"`);
    await queryRunner.query(`DROP TABLE "plan_travels_travel"`);
    await queryRunner.query(
      `ALTER TABLE "plan" DROP CONSTRAINT "FK_2b8c3f1a315b61c27a23beaf80e"`,
    );
    await queryRunner.query(`DROP TABLE "plan"`);
  }
}
