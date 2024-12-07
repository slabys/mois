import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventApplicationAddAddresses1733591959562 implements MigrationInterface {
    name = 'UpdateEventApplicationAddAddresses1733591959562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" ADD "id_card" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD "personal_address_id" integer`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "UQ_d95eaed3aced256304db27b502d" UNIQUE ("personal_address_id")`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD "invoice_address_id" integer`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "UQ_9582f0b3884fbf4b36e68533877" UNIQUE ("invoice_address_id")`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_d95eaed3aced256304db27b502d" FOREIGN KEY ("personal_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_9582f0b3884fbf4b36e68533877" FOREIGN KEY ("invoice_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_9582f0b3884fbf4b36e68533877"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_d95eaed3aced256304db27b502d"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "UQ_9582f0b3884fbf4b36e68533877"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "invoice_address_id"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "UQ_d95eaed3aced256304db27b502d"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "personal_address_id"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "id_card"`);
    }

}
