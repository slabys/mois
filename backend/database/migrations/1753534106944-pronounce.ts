import { MigrationInterface, QueryRunner } from "typeorm";

export class Pronounce1753534106944 implements MigrationInterface {
    name = 'Pronounce1753534106944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "pronounce" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pronounce"`);
    }

}
