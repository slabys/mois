import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInvoiceAddCreatedAtColumn1734192615910 implements MigrationInterface {
    name = 'UpdateInvoiceAddCreatedAtColumn1734192615910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "created_at"`);
    }

}
