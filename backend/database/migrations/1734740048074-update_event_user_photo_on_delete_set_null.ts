import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventUserPhotoOnDeleteSetNull1734740048074 implements MigrationInterface {
    name = 'UpdateEventUserPhotoOnDeleteSetNull1734740048074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_2863d588f4efce8bf42c9c63526"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_ca1a36a8d665ae39e85cfcf6f91"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_2863d588f4efce8bf42c9c63526" FOREIGN KEY ("photo_id") REFERENCES "photo"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_ca1a36a8d665ae39e85cfcf6f91" FOREIGN KEY ("photo_id") REFERENCES "photo"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_ca1a36a8d665ae39e85cfcf6f91"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_2863d588f4efce8bf42c9c63526"`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_ca1a36a8d665ae39e85cfcf6f91" FOREIGN KEY ("photo_id") REFERENCES "photo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_2863d588f4efce8bf42c9c63526" FOREIGN KEY ("photo_id") REFERENCES "photo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
