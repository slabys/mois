import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUniversityAddPhoto1731870909693 implements MigrationInterface {
    name = 'UpdateUniversityAddPhoto1731870909693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "university" ADD "photo_id" uuid`);
        await queryRunner.query(`ALTER TABLE "university" ADD CONSTRAINT "FK_6a93ec30f7494a3bb203dd1190f" FOREIGN KEY ("photo_id") REFERENCES "photo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "university" DROP CONSTRAINT "FK_6a93ec30f7494a3bb203dd1190f"`);
        await queryRunner.query(`ALTER TABLE "university" DROP COLUMN "photo_id"`);
    }

}
