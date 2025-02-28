import { MigrationInterface, QueryRunner } from "typeorm";

export class EventApplicationHealthRestrictionAllergies1740765452191 implements MigrationInterface {
    name = 'EventApplicationHealthRestrictionAllergies1740765452191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" ADD "food_restriction_allergies" character varying`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD "health_limitations" character varying`);
        await queryRunner.query(`ALTER TABLE "event_application" ALTER COLUMN "additional_information" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" ALTER COLUMN "additional_information" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "health_limitations"`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "food_restriction_allergies"`);
    }

}
