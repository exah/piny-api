import { MigrationInterface, QueryRunner } from 'typeorm'

export class NonEmptyTags1764430432588 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "tag" SET name = id WHERE name = ''`)
    await queryRunner.query(`UPDATE "user" SET name = id WHERE name = ''`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "tag" SET name = '' WHERE name = id`)
    await queryRunner.query(`UPDATE "user" SET name = '' WHERE name = id`)
  }
}
