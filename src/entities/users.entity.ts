// This decorator ensures that a field is not empty.
import { IsNotEmpty } from 'class-validator';
// Imports various decorators and classes from `typeorm`
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

// Imports the `User` interface
import { User } from '@interfaces/users.interface';
import { WalletEntity } from './wallet.entity';
import { TeaHarvestsEntity } from './harvests.entity';
import { ConsignmentEntity } from './consignment.entity';
import { ProcessingEntity } from './processing.entity';

// `BaseEntity`: Provides base methods for interacting with the database (e.g., `save`, `remove`)

// `Entity`: Marks the class as a database entity, meaning it will be mapped to a table in the database
@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique(['email'])
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  password: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  role: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  location: string;

  @Column({ type: 'varchar', length: 255, unique:true })
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

  @OneToOne(() => WalletEntity, wallet => wallet.user)
  wallet: WalletEntity;

  @OneToMany(() => TeaHarvestsEntity, harvest => harvest.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  harvest: TeaHarvestsEntity;

  @OneToMany(() => ProcessingEntity, process => process.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'packagingPlantId' })
  process: ProcessingEntity;

  // 1 user can have many consignments
  @OneToMany(() => ConsignmentEntity, harvest => harvest.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'storagePlantId' })
  consignment: ConsignmentEntity;
}
