// This decorator ensures that a field is not empty.
import { IsNotEmpty } from 'class-validator';
// Imports various decorators and classes from `typeorm`
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Imports the `User` interface
import { User } from '@interfaces/users.interface';

// `BaseEntity`: Provides base methods for interacting with the database (e.g., `save`, `remove`)

// `Entity`: Marks the class as a database entity, meaning it will be mapped to a table in the database
@Entity()
export class UserEntity extends BaseEntity implements User {
  //  Marks a property as the primary key and automatically generates its value
  @PrimaryGeneratedColumn()
  id: number;

  // Marks a property as a column in the database
  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @IsNotEmpty()
  location: string;

  @Column()
  @IsNotEmpty()
  walletAddress: string;

  @Column()
  // Automatically sets the column to the current date when a new record is created
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;
}
