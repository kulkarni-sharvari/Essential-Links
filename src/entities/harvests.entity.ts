import { TeaHarvests } from '@/interfaces/harvests.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './users.entity';
import { ProcessingEntity } from './processing.entity';

@Entity()
export class TeaHarvestsEntity extends BaseEntity implements TeaHarvests {
  @PrimaryColumn()
  harvestId: string;

  @Column({unique:true})
  @IsNotEmpty()
  userId: number;

  @Column()
  @IsNotEmpty()
  quantity: number;

  @Column()
  @IsNotEmpty()
  quality: string;

  @Column()
  // Automatically sets the column to the current date when a new record is created
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  blockchainHash: string;

  @Column()
  location: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToOne(() => ProcessingEntity, process => process.harvest)
  // @JoinColumn({ name: 'harvestId', referencedColumnName: 'harvestId' })
  process: ProcessingEntity;
}
