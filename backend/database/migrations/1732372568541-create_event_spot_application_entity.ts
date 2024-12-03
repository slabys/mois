import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEventSpotApplicationEntity1732372568541 implements MigrationInterface {
    name = 'CreateEventSpotApplicationEntity1732372568541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_spot" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "capacity" integer NOT NULL, "event_id" uuid, CONSTRAINT "PK_9ce1b9c12794bb8e915e4be19b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_application" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "spot_type_id" integer, CONSTRAINT "PK_1e1754ebb2fbf400511a36335ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event_spot" ADD CONSTRAINT "FK_f11312dbb69a7a9f8d29e46ebd5" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_80b0bce50278f872e5dd8ea4a60" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_54e6a03180415ff1924f2b50633" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_77581fd0d935f0d798d8d8cc12b" FOREIGN KEY ("spot_type_id") REFERENCES "event_spot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_77581fd0d935f0d798d8d8cc12b"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_54e6a03180415ff1924f2b50633"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_80b0bce50278f872e5dd8ea4a60"`);
        await queryRunner.query(`ALTER TABLE "event_spot" DROP CONSTRAINT "FK_f11312dbb69a7a9f8d29e46ebd5"`);
        await queryRunner.query(`DROP TABLE "event_application"`);
        await queryRunner.query(`DROP TABLE "event_spot"`);
    }

}
