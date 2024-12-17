import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventApplicationAddIdnumber1734189866370 implements MigrationInterface {
    name = 'UpdateEventApplicationAddIdnumber1734189866370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" ADD "id_number" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "id_number"`);
    }

}
