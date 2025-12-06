import { MigrationInterface, QueryRunner } from 'typeorm'

export class BookmarkTagOrder1765038297811 implements MigrationInterface {
  name = 'BookmarkTagOrder1765038297811'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_bookmark_tag" ("id" varchar PRIMARY KEY NOT NULL, "order" integer NOT NULL, "bookmarkId" varchar, "tagId" varchar, CONSTRAINT "FK_66b131399f3b96b4691165c4671" FOREIGN KEY ("bookmarkId") REFERENCES "bookmark" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_66a2344bd149fbaf7bc4198115a" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_bookmark_tag"("id", "order", "bookmarkId", "tagId") SELECT "id", 0 as "order", "bookmarkId", "tagId" FROM "bookmark_tag"`
    )
    await queryRunner.query(`DROP TABLE "bookmark_tag"`)
    await queryRunner.query(
      `ALTER TABLE "temporary_bookmark_tag" RENAME TO "bookmark_tag"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookmark_tag" RENAME TO "temporary_bookmark_tag"`
    )
    await queryRunner.query(
      `CREATE TABLE "bookmark_tag" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "bookmarkId" varchar, "tagId" varchar, CONSTRAINT "FK_66b131399f3b96b4691165c4671" FOREIGN KEY ("bookmarkId") REFERENCES "bookmark" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_66a2344bd149fbaf7bc4198115a" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "bookmark_tag"("id", "createdAt", "bookmarkId", "tagId") SELECT "id", datetime('now'), "bookmarkId", "tagId" FROM "temporary_bookmark_tag"`
    )
    await queryRunner.query(`DROP TABLE "temporary_bookmark_tag"`)
  }
}
