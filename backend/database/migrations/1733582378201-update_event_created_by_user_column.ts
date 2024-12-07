import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventCreatedByUserColumn1733582378201 implements MigrationInterface {
    name = 'UpdateEventCreatedByUserColumn1733582378201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_73a97bec2931641bb0470c88129"`);
        await queryRunner.query(`ALTER TABLE "event" RENAME COLUMN "created_by_id" TO "created_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD "additional_data" json NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "created_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "created_by_user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_161f205c6980d03ac6cf26169a1" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_161f205c6980d03ac6cf26169a1"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "created_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "created_by_user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_application" DROP COLUMN "additional_data"`);
        await queryRunner.query(`ALTER TABLE "event" RENAME COLUMN "created_by_user_id" TO "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_73a97bec2931641bb0470c88129" FOREIGN KEY ("created_by_id") REFERENCES "organization_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
