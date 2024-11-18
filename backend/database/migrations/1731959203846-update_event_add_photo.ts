import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventAddPhoto1731959203846 implements MigrationInterface {
    name = 'UpdateEventAddPhoto1731959203846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "photo_id" uuid`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_ca1a36a8d665ae39e85cfcf6f91" FOREIGN KEY ("photo_id") REFERENCES "photo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_ca1a36a8d665ae39e85cfcf6f91"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "photo_id"`);
    }

}
