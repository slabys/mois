import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAddressEntity1733584923831 implements MigrationInterface {
    name = 'CreateAddressEntity1733584923831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "zip" character varying NOT NULL, "street" character varying NOT NULL, "house_number" character varying NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
