import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrganizationAddParentCheck1734719350687 implements MigrationInterface {
    name = 'UpdateOrganizationAddParentCheck1734719350687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_15acafd6698ac846c6b6a6a50e" ON "organization" ("parent_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_single_root" ON "organization" ("id") WHERE parent_id IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_single_root"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15acafd6698ac846c6b6a6a50e"`);
    }

}
