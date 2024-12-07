import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserAddPersonalAddress1733586395993 implements MigrationInterface {
    name = 'UpdateUserAddPersonalAddress1733586395993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "personal_address_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_23dadf77c4260012ffc54ebce52" FOREIGN KEY ("personal_address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_23dadf77c4260012ffc54ebce52"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "personal_address_id"`);
    }

}
