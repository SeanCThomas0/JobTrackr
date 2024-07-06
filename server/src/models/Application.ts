import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    companyName: string;

    @Column()
    position: string;

    @Column()
    applicationDate: Date;

    @Column()
    status: string;

    @ManyToOne(() => User, user => user.applications)
    user: User;
}