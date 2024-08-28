import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Packets } from '@/interfaces/packets.interface';
import { ProcessingEntity } from './processing.entity';

@Entity()
export class PacketsEntity extends BaseEntity implements Packets {
  @PrimaryColumn()
  packageId: string;

  @Column({unique:true})
  @IsNotEmpty()
  batchId: string;

  @Column()
  @IsNotEmpty()
  weight: string;

  @Column({ nullable: true })
  blockchainHash: string;

  @Column()
  // Automatically sets the column to the current date when a new record is created
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;

  // many packets can belong to 1 batch
  // @ManyToOne(() => ProcessingEntity, (process) => process.batchId)
  // @JoinColumn({ name: 'batchId', referencedColumnName: 'batchId' })
  // process: ProcessingEntity;
}
