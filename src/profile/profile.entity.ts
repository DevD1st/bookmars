import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  dob!: Date;

  @Column()
  profilePicture!: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user!: User;
}
