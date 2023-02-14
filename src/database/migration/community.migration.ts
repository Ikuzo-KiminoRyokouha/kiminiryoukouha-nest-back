import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommunityTable1644900793067 implements MigrationInterface {
  name = 'CreateCommunityTable1644900793067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`community\` (\`id\` int NOT NULL AUTO_INCREMENT, \`img\` varchar(255) NULL, \`content\` varchar(255) NOT NULL, \`planId\` int NULL, \`userId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`community\` ADD CONSTRAINT \`FK_e21068047c0cf92a9fb73949e88\` FOREIGN KEY (\`planId\`) REFERENCES \`plan\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`community\` ADD CONSTRAINT \`FK_8b406dfb647a4c7d08b9c19f8de\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`community\` DROP FOREIGN KEY \`FK_8b406dfb647a4c7d08b9c19f8de\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`community\` DROP FOREIGN KEY \`FK_e21068047c0cf92a9fb73949e88\``,
    );
    await queryRunner.query(`DROP TABLE \`community\``);
  }
}
