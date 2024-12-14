import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventApplicationAddIdnumber1734189866370 implements MigrationInterface {
    name = 'UpdateEventApplicationAddIdnumber1734189866370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" RENAME COLUMN "id_card" TO "id_number"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" RENAME COLUMN "id_number" TO "id_card"`);
    }

}
