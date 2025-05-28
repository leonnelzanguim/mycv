import {
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Report } from '../../reports/entities/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: Boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @BeforeRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
