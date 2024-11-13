import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1731490593350 implements MigrationInterface {
    name = 'NewMigration1731490593350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "model"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "model" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "model"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "model" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(255) NOT NULL`);
    }

}
