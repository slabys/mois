import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrganizationAddManagerColumn1733584576287 implements MigrationInterface {
    name = 'UpdateOrganizationAddManagerColumn1733584576287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "manager_id" uuid`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_910e87ddd1c8e02d1bcb06c4acb" FOREIGN KEY ("manager_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_910e87ddd1c8e02d1bcb06c4acb"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "manager_id"`);
    }

}
