import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventApplicationAddCustomOrganization1734452021950 implements MigrationInterface {
    name = 'UpdateEventApplicationAddCustomOrganization1734452021950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_custom_organization" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "country" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "application_id" integer NOT NULL, CONSTRAINT "REL_7713df0ec5af5093cd5bfc980c" UNIQUE ("application_id"), CONSTRAINT "PK_1326cfa656b9a41081bd4435861" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD "organization_id" uuid`);
        await queryRunner.query(`ALTER TABLE "event_custom_organization" ADD CONSTRAINT "FK_7713df0ec5af5093cd5bfc980c5" FOREIGN KEY ("application_id") REFERENCES "event_application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_5bd09781ea23eeb0decf666193d" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_5bd09781ea23eeb0decf666193d"`);
        await queryRunner.query(`ALTER TABLE "event_custom_organization" DROP CONSTRAINT "FK_7713df0ec5af5093cd5bfc980c5"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "organization_id"`);
        await queryRunner.query(`DROP TABLE "event_custom_organization"`);
    }

}
