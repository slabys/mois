import { MigrationInterface, QueryRunner } from "typeorm";

export class EventApplicationInvoicedTo1740245052158 implements MigrationInterface {
    name = 'EventApplicationInvoicedTo1740245052158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" ADD "invoiced_to" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "invoiced_to"`);
    }

}
