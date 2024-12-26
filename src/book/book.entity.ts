import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @ManyToOne(() => User, (user) => user.authoredBooks, {
    cascade: true,
  })
  @JoinColumn()
  author!: User;

  @ManyToMany(() => User, (user) => user.bookmarkedBooks, {
    cascade: true,
  })
  @JoinTable()
  bookmarkedBy!: User[];
}
