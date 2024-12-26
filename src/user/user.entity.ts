import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToMany,
} from "typeorm";
import { Auth } from "../auth/auth.entity";
import { Profile } from "../profile/profile.entity";
import { Book } from "../book/book.entity";
import { Expose } from "class-transformer";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({})
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: "password" })
  _password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Auth, (auth) => auth.user, { cascade: true })
  auth!: Auth[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Profile;

  @OneToMany(() => Book, (book) => book.author)
  authoredBooks!: Book[];

  @ManyToMany(() => Book, (book) => book.bookmarkedBy)
  bookmarkedBooks!: Book[];
}
