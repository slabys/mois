import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventApplicationSpotTypeSetNull1732375349862 implements MigrationInterface {
    name = 'UpdateEventApplicationSpotTypeSetNull1732375349862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_77581fd0d935f0d798d8d8cc12b"`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_77581fd0d935f0d798d8d8cc12b" FOREIGN KEY ("spot_type_id") REFERENCES "event_spot"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_application" DROP CONSTRAINT "FK_77581fd0d935f0d798d8d8cc12b"`);
        await queryRunner.query(`ALTER TABLE "event_application" ADD CONSTRAINT "FK_77581fd0d935f0d798d8d8cc12b" FOREIGN KEY ("spot_type_id") REFERENCES "event_spot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
