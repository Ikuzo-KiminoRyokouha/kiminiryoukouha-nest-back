import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDestinationTable1620791303223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "destination" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "title" character varying NOT NULL,
            "mapx" character varying,
            "mapy" character varying,
            "firstimage" character varying,
            "cat3" character varying NOT NULL,
            "contentid" character varying NOT NULL,
            "contenttypeid" character varying NOT NULL,
            "description" text,
            CONSTRAINT "PK_5b5d5b5c081ee5c78e5c1ab0421" PRIMARY KEY ("id")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "destination"`);
  }
}
