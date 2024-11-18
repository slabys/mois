import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserAddPhoto1731867962054 implements MigrationInterface {
    name = 'UpdateUserAddPhoto1731867962054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "photo_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_2863d588f4efce8bf42c9c63526" FOREIGN KEY ("photo_id") REFERENCES "photo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_2863d588f4efce8bf42c9c63526"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photo_id"`);
    }

}
