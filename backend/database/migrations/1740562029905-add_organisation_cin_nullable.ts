import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrganisationCinNullable1740562029905 implements MigrationInterface {
    name = 'AddOrganisationCinNullable1740562029905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "cin" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "cin"`);
    }

}
