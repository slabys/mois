import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCustomEventApplicationCascadeDelete1734519185483 implements MigrationInterface {
    name = 'UpdateCustomEventApplicationCascadeDelete1734519185483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_custom_organization" DROP CONSTRAINT "FK_7713df0ec5af5093cd5bfc980c5"`);
        await queryRunner.query(`ALTER TABLE "event_custom_organization" ADD CONSTRAINT "FK_7713df0ec5af5093cd5bfc980c5" FOREIGN KEY ("application_id") REFERENCES "event_application"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_custom_organization" DROP CONSTRAINT "FK_7713df0ec5af5093cd5bfc980c5"`);
        await queryRunner.query(`ALTER TABLE "event_custom_organization" ADD CONSTRAINT "FK_7713df0ec5af5093cd5bfc980c5" FOREIGN KEY ("application_id") REFERENCES "event_application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
