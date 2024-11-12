import {MigrationInterface, QueryRunner} from "typeorm"

export class Users1731357397744 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users"
            (
                "id"         uuid         NOT NULL DEFAULT uuid_generate_v4(),
                "name"       varchar(255) NOT NULL,
                "email"      varchar(100) NOT NULL,
                "password"   varchar(255) NOT NULL,
                "created_at" TIMESTAMP    NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP    NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            ) ,
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
