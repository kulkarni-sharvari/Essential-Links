// Imports various decorators and classes from `typeorm`
import { BaseEntity, Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToOne, Unique, JoinColumn } from 'typeorm';
// This decorator ensures that a field is not empty.
import { IsNotEmpty } from 'class-validator';

import { Wallet } from '@/interfaces/wallet.interface';
import { UserEntity } from './users.entity';
@Entity()
export class WalletEntity extends BaseEntity implements Wallet {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  walletId: string;

  @Column({unique:true})
  @IsNotEmpty()
  userId: number;


  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  @IsNotEmpty()
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsNotEmpty()
  publicKey?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsNotEmpty()
  privateKey?: string;

  @Column({ type: 'text', nullable: true })
  @IsNotEmpty()
  mnemonic?: string;

  @Column()
  // Automatically sets the column to the current date when a new record is created
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'address', referencedColumnName: 'walletAddress' })
  user: UserEntity;

}
