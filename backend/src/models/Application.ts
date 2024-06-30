// backend/src/models/Application.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Application {
  static find() {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyName!: string;

  @Column()
  position!: string;

  @Column()
  status!: string;
}
