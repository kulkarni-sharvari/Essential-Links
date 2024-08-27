// Imports various decorators and classes from `typeorm`
import { BaseEntity, Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
// This decorator ensures that a field is not empty.
import { IsNotEmpty } from 'class-validator';

import { Wallet } from '@/interfaces/wallet.interface';
@Entity()
export class WalletEntity extends BaseEntity implements Wallet {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  walletId: string;

  @Column()
  @IsNotEmpty()
  userId: number;

  @Column()
  @IsNotEmpty()
  address: string;

  @Column()
  @IsNotEmpty()
  publicKey: string;

  @Column()
  @IsNotEmpty()
  privateKey: string;

  @Column()
  @IsNotEmpty()
  mnemonic: string;

  @Column()
  // Automatically sets the column to the current date when a new record is created
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;
}
