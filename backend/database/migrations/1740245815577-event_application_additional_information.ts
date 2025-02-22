import { MigrationInterface, QueryRunner } from "typeorm";

export class EventApplicationAdditionalInformation1740245815577 implements MigrationInterface {
    name = 'EventApplicationAdditionalInformation1740245815577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" ADD "additional_information" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "additional_information"`);
    }

}
