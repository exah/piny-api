import { MigrationInterface, QueryRunner } from 'typeorm'

export class Session1764551089731 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create new session table with final schema
    await queryRunner.query(
      `CREATE TABLE "session_new" (
        "id" varchar NOT NULL,
        "token" text NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "expiresAt" datetime NOT NULL,
        "userId" varchar,
        "deviceId" text,
        "deviceDescription" text,
        "version" integer NOT NULL,
        "succeedingSessionId" varchar,
        "succeedingSessionToken" text,
        CONSTRAINT "UQ_232f8e85d7633bd6ddfad421696" UNIQUE ("token"),
        CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId")
          REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_18d6892b72cc991fa249c46fe77" FOREIGN KEY ("succeedingSessionId", "succeedingSessionToken")
          REFERENCES "session_new" ("id", "token") ON DELETE NO ACTION ON UPDATE NO ACTION,
        PRIMARY KEY ("id", "token")
      )`
    )

    // Migrate data with transformations
    await queryRunner.query(
      `INSERT INTO "session_new" (
        "id", "token", "expiresAt", "createdAt", "updatedAt", "userId", "version"
      )
      SELECT
        "id",
        "token",
        datetime("expiration" / 1000, 'unixepoch') as "expiresAt",
        "createdAt",
        "updatedAt",
        "userId",
        1 as "version"
      FROM "session"`
    )

    // Replace old table
    await queryRunner.query(`DROP TABLE "session"`)
    await queryRunner.query(`ALTER TABLE "session_new" RENAME TO "session"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Create old session table schema
    await queryRunner.query(
      `CREATE TABLE "session_old" (
        "id" varchar NOT NULL,
        "token" text NOT NULL,
        "expiration" integer NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "userId" varchar,
        CONSTRAINT "UQ_232f8e85d7633bd6ddfad421696" UNIQUE ("token"),
        CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId")
          REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        PRIMARY KEY ("id", "token")
      )`
    )

    // Migrate data back
    await queryRunner.query(
      `INSERT INTO "session_old" (
        "id", "token", "expiration", "createdAt", "updatedAt", "userId"
      )
      SELECT
        "id",
        "token",
        unixepoch("expiresAt") * 1000 as "expiration",
        "createdAt",
        "updatedAt",
        "userId"
      FROM "session"`
    )

    // Replace current table
    await queryRunner.query(`DROP TABLE "session"`)
    await queryRunner.query(`ALTER TABLE "session_old" RENAME TO "session"`)
  }
}
