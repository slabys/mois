import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityShortDescription1733577520462 implements MigrationInterface {
    name = 'UpdateEntityShortDescription1733577520462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "short_description" character varying NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "event" ADD "long_description" character varying NULL DEFAULT ''`);
        
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "short_description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "long_description" SET NOT NULL`);

        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "short_description" DROP DEFAULT`)
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "long_description" DROP DEFAULT`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "long_description"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "short_description"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "description" character varying NOT NULL`);
    }

}
