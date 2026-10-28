import {
  AfterRemove,
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { IsMimeType } from "class-validator";
import { rmSync } from "fs";

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  path!: string;

  @Column()
  @IsMimeType()
  mimetype!: string;

  @Column()
  originalName!: string;

  @ManyToOne(() => User, (user) => user.quizzes)
  createdBy!: User;

  @AfterRemove()
  deleteFile() {
    try {
      rmSync(this.path);
    } catch {
      console.error(`unable to delete file ${this.path}`);
    }
  }
}
