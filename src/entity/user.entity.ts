import {Column, Entity} from "typeorm";
import {Car} from "./cars.entity";
import {BaseClass} from "./BaseClass";

@Entity({
    name: "users",
})
export class User extends BaseClass {
    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
    })
    name: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
    })
    email: string;

    @Column({
        type: "varchar",
        length: 255,
        select: false,
        nullable: false,
    })
    password: string;
    cars: Car[];
}
