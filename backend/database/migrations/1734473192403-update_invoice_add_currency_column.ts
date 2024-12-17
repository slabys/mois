import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInvoiceAddCurrencyColumn1734473192403 implements MigrationInterface {
    name = 'UpdateInvoiceAddCurrencyColumn1734473192403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invoice_currency_enum" AS ENUM('CZK', 'EUR')`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "currency" "public"."invoice_currency_enum" NOT NULL DEFAULT 'CZK'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "currency"`);
        await queryRunner.query(`DROP TYPE "public"."invoice_currency_enum"`);
    }

}
