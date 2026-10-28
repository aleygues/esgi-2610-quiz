import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { MaxLength, MinLength } from "class-validator";

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(5)
  @MaxLength(255)
  title!: string;

  @ManyToOne(() => User, (user) => user.quizzes)
  createdBy!: User;
}
