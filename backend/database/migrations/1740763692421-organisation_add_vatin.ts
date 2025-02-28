import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganisationAddVatin1740763692421 implements MigrationInterface {
    name = 'OrganisationAddVatin1740763692421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "vatin" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "vatin"`);
    }

}
