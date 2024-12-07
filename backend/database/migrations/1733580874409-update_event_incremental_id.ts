import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventIncrementalId1733580874409 implements MigrationInterface {
    name = 'UpdateEventIncrementalId1733580874409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9d0d870657c4fac264cdca048e"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "UQ_9d0d870657c4fac264cdca048e8"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_54e6a03180415ff1924f2b50633"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "UQ_9d199138fbb3111d36af9764c56"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "event_id"`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD "event_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_link" DROP CONSTRAINT "FK_814b7f00bd77e16d112f89764a4"`);
        await queryRunner.query(`ALTER TABLE "event_link" DROP COLUMN "event_id"`);
        await queryRunner.query(`ALTER TABLE "event_link" ADD "event_id" integer`);
        await queryRunner.query(`ALTER TABLE "event_spot" DROP CONSTRAINT "FK_f11312dbb69a7a9f8d29e46ebd5"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "event_spot" DROP COLUMN "event_id"`);
        await queryRunner.query(`ALTER TABLE "event_spot" ADD "event_id" integer`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "UQ_9d199138fbb3111d36af9764c56" UNIQUE ("user_id", "event_id")`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_54e6a03180415ff1924f2b50633" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_link" ADD CONSTRAINT "FK_814b7f00bd77e16d112f89764a4" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_spot" ADD CONSTRAINT "FK_f11312dbb69a7a9f8d29e46ebd5" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_spot" DROP CONSTRAINT "FK_f11312dbb69a7a9f8d29e46ebd5"`);
        await queryRunner.query(`ALTER TABLE "event_link" DROP CONSTRAINT "FK_814b7f00bd77e16d112f89764a4"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_54e6a03180415ff1924f2b50633"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "UQ_9d199138fbb3111d36af9764c56"`);
        await queryRunner.query(`ALTER TABLE "event_spot" DROP COLUMN "event_id"`);
        await queryRunner.query(`ALTER TABLE "event_spot" ADD "event_id" uuid`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "event_spot" ADD CONSTRAINT "FK_f11312dbb69a7a9f8d29e46ebd5" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_link" DROP COLUMN "event_id"`);
        await queryRunner.query(`ALTER TABLE "event_link" ADD "event_id" uuid`);
        await queryRunner.query(`ALTER TABLE "event_link" ADD CONSTRAINT "FK_814b7f00bd77e16d112f89764a4" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "event_id"`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD "event_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "UQ_9d199138fbb3111d36af9764c56" UNIQUE ("user_id", "event_id")`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_54e6a03180415ff1924f2b50633" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "UQ_9d0d870657c4fac264cdca048e8" UNIQUE ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_9d0d870657c4fac264cdca048e" ON "event" ("slug") `);
    }

}
