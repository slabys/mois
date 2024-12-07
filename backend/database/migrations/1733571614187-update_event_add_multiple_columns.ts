import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventAddMultipleColumns1733571614187 implements MigrationInterface {
    name = 'UpdateEventAddMultipleColumns1733571614187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_subject" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "house_number" character varying NOT NULL, "region" character varying NOT NULL, "street" character varying NOT NULL, "zip" character varying NOT NULL, "cin" character varying, "vat_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ff0d1ccdd487bd65dc5814d37c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_link" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "link" character varying NOT NULL, "event_id" uuid, CONSTRAINT "PK_876946eee7cfae7d33d88610630" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event" ADD "registration_deadline" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "generate_invoices" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "event" ADD "registration_form" json NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "event" ADD "capacity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_link" ADD CONSTRAINT "FK_814b7f00bd77e16d112f89764a4" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_link" DROP CONSTRAINT "FK_814b7f00bd77e16d112f89764a4"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "capacity"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "registration_form"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "generate_invoices"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "registration_deadline"`);
        await queryRunner.query(`DROP TABLE "event_link"`);
        await queryRunner.query(`DROP TABLE "payment_subject"`);
    }

}
