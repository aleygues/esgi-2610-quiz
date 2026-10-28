import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quiz } from "./Quiz";
import { IsEmail, IsHash, IsStrongPassword } from "class-validator";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  @IsHash("sha256")
  password!: string;

  @OneToMany(() => Quiz, (quiz) => quiz.createdBy)
  quizzes!: Quiz[];
}

export class UserInput {
  @IsEmail()
  email!: string;

  @IsStrongPassword()
  password!: string;

  constructor(body: UserInput) {
    Object.assign(this, body);
  }
}
