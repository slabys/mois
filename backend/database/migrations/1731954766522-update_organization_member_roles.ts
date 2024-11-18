import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrganizationMemberRoles1731954766522 implements MigrationInterface {
    name = 'UpdateOrganizationMemberRoles1731954766522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization_member_roles_role" ("organization_member_id" integer NOT NULL, "role_id" character varying NOT NULL, CONSTRAINT "PK_4b1012568b3a0d4f88ccd13d182" PRIMARY KEY ("organization_member_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86230826e3a28e0756403dcbb4" ON "organization_member_roles_role" ("organization_member_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5c68f85f1ecc8132cd5e03f3f9" ON "organization_member_roles_role" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "organization_member_roles_role" ADD CONSTRAINT "FK_86230826e3a28e0756403dcbb49" FOREIGN KEY ("organization_member_id") REFERENCES "organization_member"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles_role" ADD CONSTRAINT "FK_5c68f85f1ecc8132cd5e03f3f97" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_member_roles_role" DROP CONSTRAINT "FK_5c68f85f1ecc8132cd5e03f3f97"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles_role" DROP CONSTRAINT "FK_86230826e3a28e0756403dcbb49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c68f85f1ecc8132cd5e03f3f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86230826e3a28e0756403dcbb4"`);
        await queryRunner.query(`DROP TABLE "organization_member_roles_role"`);
    }

}
