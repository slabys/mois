import { MigrationInterface, QueryRunner } from "typeorm";

export class PermissionsUpdateManageApplications1740509651832 implements MigrationInterface {
    name = 'PermissionsUpdateManageApplications1740509651832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."role_permissions_enum" RENAME TO "role_permissions_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."role_permissions_enum" AS ENUM('event.create', 'event.update', 'event.duplicate', 'event.manageApplications', 'organisation.create', 'organisation.update', 'organisation.addUser', 'organisation.updateUser', 'organisation.deleteUser', 'role.create', 'role.update', 'role.delete')`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "permissions" TYPE "public"."role_permissions_enum"[] USING "permissions"::"text"::"public"."role_permissions_enum"[]`);
        await queryRunner.query(`DROP TYPE "public"."role_permissions_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."role_permissions_enum_old" AS ENUM('event.create', 'event.update', 'event.duplicate', 'organisation.create', 'organisation.update', 'organisation.addUser', 'organisation.updateUser', 'organisation.deleteUser', 'role.create', 'role.update', 'role.delete')`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "permissions" TYPE "public"."role_permissions_enum_old"[] USING "permissions"::"text"::"public"."role_permissions_enum_old"[]`);
        await queryRunner.query(`DROP TYPE "public"."role_permissions_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."role_permissions_enum_old" RENAME TO "role_permissions_enum"`);
    }

}
