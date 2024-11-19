import { query } from "express";
import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteUniversityEntity1732042179106 implements MigrationInterface {
    name = 'DeleteUniversityEntity1732042179106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1518391a178a27840edf478c7b9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "university_id"`);
        await queryRunner.query(`DROP TABLE "university"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "university_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1518391a178a27840edf478c7b9" FOREIGN KEY ("university_id") REFERENCES "university"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
