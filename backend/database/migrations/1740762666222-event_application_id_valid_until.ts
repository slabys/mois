import { MigrationInterface, QueryRunner } from "typeorm";

export class EventApplicationIdValidUntil1740762666222 implements MigrationInterface {
    name = 'EventApplicationIdValidUntil1740762666222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" ADD "valid_until" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "valid_until"`);
    }

}
