import {Column, Entity} from "typeorm";
import {Car} from "./cars.entity";
import {Baseclass} from "./baseclass";

@Entity({
    name: "users",
})
export class User extends Baseclass {
    @Column({
        type: "varchar",
        length: 150,
        nullable: false,
    })
    name: string;

    @Column({
        type: "varchar",
        length: 150,
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
