import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Application } from ".//Application";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => Application, application => application.user)
    applications: Application[];
}