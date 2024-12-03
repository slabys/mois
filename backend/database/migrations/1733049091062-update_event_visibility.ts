import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventVisibility1733049091062 implements MigrationInterface {
    name = 'UpdateEventVisibility1733049091062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "visible" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "visible"`);
    }

}
