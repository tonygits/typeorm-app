import {Column, Entity, Index, JoinColumn, ManyToOne} from "typeorm";
import { User } from "./user.entity";
import {BaseClass} from "./BaseClass";

@Entity({
  name: "cars",
})
export class Car extends BaseClass{
  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  model: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  year: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  color: string;

  @ManyToOne(() => User, (user) => user.cars, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @Index("user_id_idx")
  @JoinColumn({
    name: "user_id"
  })
  user_id: string;
  user: User;
}
