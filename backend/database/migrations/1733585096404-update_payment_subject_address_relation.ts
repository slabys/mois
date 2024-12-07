import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePaymentSubjectAddressRelation1733585096404 implements MigrationInterface {
    name = 'UpdatePaymentSubjectAddressRelation1733585096404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_subject" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "payment_subject" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "payment_subject" DROP COLUMN "house_number"`);
        await queryRunner.query(`ALTER TABLE "payment_subject" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "payment_subject" DROP COLUMN "street"`);
        await queryRunner.query(`ALTER TABLE "payment_subject" DROP COLUMN "zip"`);
        await queryRunner.query(`ALTER TABLE "payment_subject" ADD "address_id" integer`);
        await queryRunner.query(`ALTER TABLE "payment_subject" ADD CONSTRAINT "UQ_830895e6f7ce045b2f85c3ff59d" UNIQUE ("address_id")`);
        await queryRunner.query(`ALTER TABLE "payment_subject" ADD CONSTRAINT "FK_830895e6f7ce045b2f85c3ff59d" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_subject" DROP CONSTRAINT "FK_830895e6f7ce045b2f85c3ff59d"`);
        await queryRunner.query(`ALTER TABLE "payment_subject" DROP CONSTRAINT "UQ_830895e6f7ce045b2f85c3ff59d"`);
        await queryRunner.query(`ALTER TABLE "payment_subject" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "payment_subject" ADD "zip" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_subject" ADD "street" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_subject" ADD "region" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_subject" ADD "house_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_subject" ADD "country" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_subject" ADD "city" character varying NOT NULL`);
    }

}
