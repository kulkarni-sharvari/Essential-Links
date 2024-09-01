// This decorator ensures that a field is not empty.
import { Transaction } from '@/interfaces/transaction.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

// `BaseEntity`: Provides base methods for interacting with the database (e.g., `save`, `remove`)

// `Entity`: Marks the class as a database entity, meaning it will be mapped to a table in the database
@Entity()
export class TransactionEntity extends BaseEntity implements Transaction {
  @PrimaryColumn()
  requestId: string;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  methodName: string;

  @Column({ type: 'varchar', length:255, nullable:true })
  @IsNotEmpty()
  payload: string;

  @Column()
  @IsNotEmpty()
  userId: number;

  @Column()
  @IsNotEmpty()
  entityId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsNotEmpty()
  errorMessage: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  txHash: string;

  @Column()
  // Automatically sets the column to the current date when a new record is created
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;
}
