import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrganizationEntities1731836755437 implements MigrationInterface {
    name = 'CreateOrganizationEntities1731836755437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization_member" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" character varying, "user_id" uuid NOT NULL, CONSTRAINT "PK_81dbbb093cbe0539c170f3d1484" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" character varying NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "parent_id" character varying, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "organization_member" ADD CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_member" ADD CONSTRAINT "FK_273aa659a4afdcb614cdecbd667" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_15acafd6698ac846c6b6a6a50ec" FOREIGN KEY ("parent_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_15acafd6698ac846c6b6a6a50ec"`);
        await queryRunner.query(`ALTER TABLE "organization_member" DROP CONSTRAINT "FK_273aa659a4afdcb614cdecbd667"`);
        await queryRunner.query(`ALTER TABLE "organization_member" DROP CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "organization_member"`);
    }

}
