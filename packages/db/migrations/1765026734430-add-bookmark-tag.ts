import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBookmarkTag1765026734430 implements MigrationInterface {
  name = 'AddBookmarkTag1765026734430'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bookmark_tag" (
        "id" varchar PRIMARY KEY NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "bookmarkId" varchar,
        "tagId" varchar,
        CONSTRAINT "FK_66b131399f3b96b4691165c4671" FOREIGN KEY ("bookmarkId") REFERENCES "bookmark" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_66a2344bd149fbaf7bc4198115a" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`
    )

    const relations = await queryRunner.query(
      `SELECT "tagId", "bookmarkId" FROM "tag_bookmarks_bookmark"`
    )

    for (const relation of relations) {
      await queryRunner.query(
        `INSERT INTO "bookmark_tag" ("id", "bookmarkId", "tagId", "createdAt") VALUES (?, ?, ?, datetime('now'))`,
        [crypto.randomUUID(), relation.bookmarkId, relation.tagId]
      )
    }

    await queryRunner.query(`DROP INDEX "IDX_b115c43e5e5b2dc2b3ad7621e1"`)
    await queryRunner.query(`DROP INDEX "IDX_276a0f4fbe04cc5b9514fa3c91"`)
    await queryRunner.query(`DROP TABLE "tag_bookmarks_bookmark"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag_bookmarks_bookmark" (
        "tagId" varchar NOT NULL,
        "bookmarkId" varchar NOT NULL,
        CONSTRAINT "FK_b115c43e5e5b2dc2b3ad7621e16" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_276a0f4fbe04cc5b9514fa3c912" FOREIGN KEY ("bookmarkId") REFERENCES "bookmark" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        PRIMARY KEY ("tagId", "bookmarkId")
      )`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_b115c43e5e5b2dc2b3ad7621e1" ON "tag_bookmarks_bookmark" ("tagId")`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_276a0f4fbe04cc5b9514fa3c91" ON "tag_bookmarks_bookmark" ("bookmarkId")`
    )

    await queryRunner.query(
      `INSERT INTO "tag_bookmarks_bookmark" ("tagId", "bookmarkId")
       SELECT "tagId", "bookmarkId" FROM "bookmark_tag"`
    )

    await queryRunner.query(`DROP TABLE "bookmark_tag"`)
  }
}
