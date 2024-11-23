import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventApplicationUniqueUserEvent1732376996083 implements MigrationInterface {
    name = 'UpdateEventApplicationUniqueUserEvent1732376996083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "UQ_9d199138fbb3111d36af9764c56" UNIQUE ("user_id", "event_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "UQ_9d199138fbb3111d36af9764c56"`);
    }

}
