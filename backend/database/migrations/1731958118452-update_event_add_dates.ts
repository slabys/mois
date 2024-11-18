import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventAddDates1731958118452 implements MigrationInterface {
    name = 'UpdateEventAddDates1731958118452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "since" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "until" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "until"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "since"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "description"`);
    }

}
