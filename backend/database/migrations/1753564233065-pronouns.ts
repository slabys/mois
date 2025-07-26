import { MigrationInterface, QueryRunner } from "typeorm";

export class Pronouns1753564233065 implements MigrationInterface {
    name = 'Pronouns1753564233065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "pronounce" TO "pronouns"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "pronouns" TO "pronounce"`);
    }

}
