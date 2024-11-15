import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1731682588148 implements MigrationInterface {
    name = 'NewMigration1731682588148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(150) NOT NULL`);
        await queryRunner.query(`CREATE INDEX "cars_name_idx" ON "cars" ("color") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."cars_name_idx"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(100) NOT NULL`);
    }

}
