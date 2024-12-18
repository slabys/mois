import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventSpotAddCurrencyColumn1734522536967 implements MigrationInterface {
    name = 'UpdateEventSpotAddCurrencyColumn1734522536967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."event_spot_currency_enum" AS ENUM('CZK', 'EUR')`);
        await queryRunner.query(`ALTER TABLE "event_spot" ADD "currency" "public"."event_spot_currency_enum" NOT NULL DEFAULT 'CZK'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_spot" DROP COLUMN "currency"`);
        await queryRunner.query(`DROP TYPE "public"."event_spot_currency_enum"`);
    }

}
