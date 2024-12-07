import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrganizationGeneratedId1733574597065 implements MigrationInterface {
    name = 'UpdateOrganizationGeneratedId1733574597065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_member" DROP CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7"`);
        await queryRunner.query(`ALTER TABLE "organization_member" DROP COLUMN "organization_id"`);
        await queryRunner.query(`ALTER TABLE "organization_member" ADD "organization_id" uuid`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_15acafd6698ac846c6b6a6a50ec"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "parent_id" uuid`);
        await queryRunner.query(`ALTER TABLE "organization_member" ADD CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_15acafd6698ac846c6b6a6a50ec" FOREIGN KEY ("parent_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_15acafd6698ac846c6b6a6a50ec"`);
        await queryRunner.query(`ALTER TABLE "organization_member" DROP CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "parent_id" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_15acafd6698ac846c6b6a6a50ec" FOREIGN KEY ("parent_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_member" DROP COLUMN "organization_id"`);
        await queryRunner.query(`ALTER TABLE "organization_member" ADD "organization_id" character varying`);
        await queryRunner.query(`ALTER TABLE "organization_member" ADD CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
