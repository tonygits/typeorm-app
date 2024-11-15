import {Column, Entity, Index, JoinColumn, ManyToOne} from "typeorm";
import { User } from "./user.entity";
import {Baseclass} from "./baseclass";

@Entity({
  name: "cars",
})
export class Car extends Baseclass{
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
  model: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  year: string;

  @Index("cars_name_idx")
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  color: string;

  @ManyToOne(() => User, (user) => user.cars, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @Index("cars_user_id_idx")
  @JoinColumn({
    name: "user_id",
    referencedColumnName: 'id',
  })
  user_id: string
  user: User;
}
