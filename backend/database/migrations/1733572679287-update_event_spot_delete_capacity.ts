import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventSpotDeleteCapacity1733572679287 implements MigrationInterface {
    name = 'UpdateEventSpotDeleteCapacity1733572679287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_spot" DROP COLUMN "capacity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_spot" ADD "capacity" integer NOT NULL`);
    }

}
