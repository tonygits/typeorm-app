import {MigrationInterface, QueryRunner} from "typeorm"

export class Cars1731357930523 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "cars"
            (
                "id"         uuid         NOT NULL DEFAULT uuid_generate_v4(),
                "name"       varchar(255) NOT NULL,
                "model"      varchar(255) NOT NULL,
                "year"       varchar(50)  NOT NULL,
                "color"      varchar(100) NOT NULL,
                "user_id"    uuid         NOT NULL,
                "created_at" TIMESTAMP    NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP    NOT NULL DEFAULT now(),
                CONSTRAINT "PK_44245f43646104491f490f08554" PRIMARY KEY ("id"),
                CONSTRAINT "FK_852493404f58b7992c049e56019" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
            )
        `),
            await queryRunner.query(`
                CREATE INDEX cars_user_id_idx ON "cars" ("user_id"); `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "cars_user_id_idx"`);
        await queryRunner.query(` DROP TABLE "cars"`);
    }
}
