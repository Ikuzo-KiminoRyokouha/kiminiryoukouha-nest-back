import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoardTable1644862349059 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE board (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            user_id INT UNSIGNED,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            secret BOOLEAN NOT NULL,
            complete BOOLEAN NOT NULL DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE board`);
  }
}
