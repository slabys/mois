import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendUserBirthNationalityPhone1740753062055 implements MigrationInterface {
    name = 'ExtendUserBirthNationalityPhone1740753062055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "birth_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "nationality" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone_number" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nationality"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birth_date"`);
    }

}
