import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentTable1644882372182 implements MigrationInterface {
  name = 'CreateCommentTable1644882372182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" int NOT NULL AUTO_INCREMENT, "created_at" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP(), "updated_at" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP(), "user_id" int NOT NULL, "board_id" int NOT NULL, "group" int NULL, "target_id" int NULL, "content" varchar(255) NOT NULL, PRIMARY KEY ("id")) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_7f80fd888bcfd6628d0e30ac9aa" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_8f50d698e69a7efcfe156209d18" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_9bfb63dc82b81d8dfe0a891d900" FOREIGN KEY ("group") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_0a946ce03f36e3a3cc3e10cc550" FOREIGN KEY ("target_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP FOREIGN KEY "FK_0a946ce03f36e3a3cc3e10cc550"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP FOREIGN KEY "FK_9bfb63dc82b81d8dfe0a891d900"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP FOREIGN KEY "FK_8f50d698e69a7efcfe156209d18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP FOREIGN KEY "FK_7f80fd888bcfd6628d0e30ac9aa"`,
    );
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
