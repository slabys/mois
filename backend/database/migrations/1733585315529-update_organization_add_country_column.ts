import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrganizationAddCountryColumn1733585315529 implements MigrationInterface {
    name = 'UpdateOrganizationAddCountryColumn1733585315529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "country" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "country"`);
    }

}
