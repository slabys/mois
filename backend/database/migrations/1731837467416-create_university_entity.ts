import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUniversityEntity1731837467416 implements MigrationInterface {
    name = 'CreateUniversityEntity1731837467416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "university" ("id" character varying NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d14e5687dbd51fd7a915c22ac13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "university"("id", "name") VALUES ('changeme', 'changeme')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "university_id" character varying NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1518391a178a27840edf478c7b9" FOREIGN KEY ("university_id") REFERENCES "university"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`UPDATE "user" SET "university_id" = 'changeme'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "university_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1518391a178a27840edf478c7b9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "university_id"`);
        await queryRunner.query(`DROP TABLE "university"`);
    }

}
