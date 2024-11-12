import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export class BaseClass {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        name: "created_at",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        name: "updated_at",
    })
    updated_at: Date;
}