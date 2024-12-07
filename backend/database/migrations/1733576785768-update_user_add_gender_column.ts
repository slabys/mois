import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserAddGenderColumn1733576785768 implements MigrationInterface {
    name = 'UpdateUserAddGenderColumn1733576785768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'non-binary', 'prefer-not-to-say')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" "public"."user_gender_enum" NOT NULL DEFAULT 'prefer-not-to-say'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    }

}
