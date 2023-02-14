import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1634144917913 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user" (
            "id" SERIAL NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "nickname" character varying NOT NULL,
            "description" character varying,
            "role" character varying NOT NULL,
            "refreshToken" character varying,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
            CONSTRAINT "UQ_f10ab4b4ff4ae3d3e4374de38f1" UNIQUE ("nickname")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
