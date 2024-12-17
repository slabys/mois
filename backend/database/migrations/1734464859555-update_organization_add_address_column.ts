import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrganizationAddAddressColumn1734464859555 implements MigrationInterface {
    name = 'UpdateOrganizationAddAddressColumn1734464859555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" RENAME COLUMN "country" TO "address_id"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "address_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_0f31fe3925535afb5462326d7d6" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_0f31fe3925535afb5462326d7d6"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "address_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" RENAME COLUMN "address_id" TO "country"`);
    }

}
