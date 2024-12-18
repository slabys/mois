import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventApplicationAddInvoiceColumn1734520653600 implements MigrationInterface {
    name = 'UpdateEventApplicationAddInvoiceColumn1734520653600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" ADD "invoice_id" character varying`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_09e7a76f7b9e9e648ea3ecd7fb0" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_09e7a76f7b9e9e648ea3ecd7fb0"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "invoice_id"`);
    }

}
