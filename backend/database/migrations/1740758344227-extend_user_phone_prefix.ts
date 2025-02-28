import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendUserPhonePrefix1740758344227 implements MigrationInterface {
    name = 'ExtendUserPhonePrefix1740758344227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone_prefix" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone_prefix"`);
    }

}
