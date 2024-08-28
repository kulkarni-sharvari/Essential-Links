// Imports various decorators and classes from `typeorm`
import { BaseEntity, Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
// This decorator ensures that a field is not empty.
import { IsNotEmpty } from 'class-validator';

import { Processing } from '@/interfaces/processing.interface';
import { TeaHarvestsEntity } from './harvests.entity';
import { PacketsEntity } from './packets.entity';
@Entity()
export class ProcessingEntity extends BaseEntity implements Processing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
  @IsNotEmpty()
  harvestId: string;

  @Column({ nullable: true })
  batchId: string;

  @Column()
  @IsNotEmpty()
  processType: string;

  @Column()
  @IsNotEmpty()
  packagingPlantId: number;

  @Column({ nullable: true })
  noOfPackets: number;

  @Column()
  // Automatically sets the column to the current date when a new record is created
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => TeaHarvestsEntity, harvest => harvest.process)
  @JoinColumn({ name: 'harvestId', referencedColumnName: 'harvestId' })
  harvest: TeaHarvestsEntity;

  // 1 batch can have many packets
  // @OneToMany(() => PacketsEntity, packet => packet.process)
  // @JoinColumn({ name: 'batchId', referencedColumnName: 'batchId' })
  // packet: PacketsEntity;
}
