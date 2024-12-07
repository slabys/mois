import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventUniqueSlug1733576481324 implements MigrationInterface {
    name = 'UpdateEventUniqueSlug1733576481324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "UQ_9d0d870657c4fac264cdca048e8" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "UQ_9d0d870657c4fac264cdca048e8"`);
    }

}
