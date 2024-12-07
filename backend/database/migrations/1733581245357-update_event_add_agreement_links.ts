import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventAddAgreementLinks1733581245357 implements MigrationInterface {
    name = 'UpdateEventAddAgreementLinks1733581245357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "terms_and_conditions_link" character varying NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "photo_policy_link" character varying NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "code_of_conduct_link" character varying NULL`);

        await queryRunner.query(`UPDATE "event" SET "terms_and_conditions_link"='', "photo_policy_link"='', "code_of_conduct_link"=''`);

        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "terms_and_conditions_link" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "photo_policy_link" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "code_of_conduct_link" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "code_of_conduct_link"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "photo_policy_link"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "terms_and_conditions_link"`);
    }

}
