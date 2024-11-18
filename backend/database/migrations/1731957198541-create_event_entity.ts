import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEventEntity1731957198541 implements MigrationInterface {
    name = 'CreateEventEntity1731957198541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9d0d870657c4fac264cdca048e" ON "event" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9d0d870657c4fac264cdca048e"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }

}
