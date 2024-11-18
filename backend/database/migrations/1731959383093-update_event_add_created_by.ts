import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventAddCreatedBy1731959383093 implements MigrationInterface {
    name = 'UpdateEventAddCreatedBy1731959383093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "created_by_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_73a97bec2931641bb0470c88129" FOREIGN KEY ("created_by_id") REFERENCES "organization_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_73a97bec2931641bb0470c88129"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "created_by_id"`);
    }

}
