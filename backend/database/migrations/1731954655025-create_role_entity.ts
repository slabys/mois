import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoleEntity1731954655025 implements MigrationInterface {
  name = "CreateRoleEntity1731954655025";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the enum type exists
    const typeExists = await queryRunner.query(`
        SELECT EXISTS (SELECT 1
                       FROM pg_type
                       WHERE typname = 'role_permissions_enum')
    `);

    if (!typeExists[0].exists) {
      await queryRunner.query(`CREATE TYPE "public"."role_permissions_enum" AS ENUM('create.event')`);
    }

    await queryRunner.query(`CREATE TABLE "role"
                             (
                                 "id"          character varying NOT NULL,
                                 "name"        character varying NOT NULL,
                                 "permissions" "public"."role_permissions_enum" array NOT NULL,
                                 CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."role_permissions_enum"`);
  }

}
