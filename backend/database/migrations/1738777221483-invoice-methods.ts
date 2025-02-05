import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceMethods1738777221483 implements MigrationInterface {
    name = 'InvoiceMethods1738777221483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."InvoiceMethods" AS ENUM('personal', 'organisation', 'different')`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD "invoice_method" "public"."InvoiceMethods" NOT NULL DEFAULT 'personal'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "invoice_method"`);
        await queryRunner.query(`DROP TYPE "public"."InvoiceMethods"`);
    }

}
