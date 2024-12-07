import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventNullableRegistrationForm1733583857162 implements MigrationInterface {
    name = 'UpdateEventNullableRegistrationForm1733583857162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "registration_form" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "registration_form" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "registration_form" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "registration_form" SET NOT NULL`);
    }

}
