import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvoiceEntities1734191804254 implements MigrationInterface {
    name = 'CreateInvoiceEntities1734191804254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice_item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "amount" integer NOT NULL, "invoice_id" character varying, CONSTRAINT "PK_621317346abdf61295516f3cb76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice" ("id" character varying NOT NULL, "iban" character varying NOT NULL, "swift" character varying NOT NULL, "variable_symbol" integer NOT NULL, "constant_symbol" integer NOT NULL, "supplier_id" uuid, "subscriber_id" uuid, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoice_item" ADD CONSTRAINT "FK_9830c1881dd701d440c2164c3cd" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_8d86c7034ecfb05a14e541b5b67" FOREIGN KEY ("supplier_id") REFERENCES "payment_subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_a4a4f71f43407a3fb0e946ad3f9" FOREIGN KEY ("subscriber_id") REFERENCES "payment_subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_a4a4f71f43407a3fb0e946ad3f9"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_8d86c7034ecfb05a14e541b5b67"`);
        await queryRunner.query(`ALTER TABLE "invoice_item" DROP CONSTRAINT "FK_9830c1881dd701d440c2164c3cd"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TABLE "invoice_item"`);
    }

}
