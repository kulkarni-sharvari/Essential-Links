import { Consignment } from '@/interfaces/consignment.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ProcessingEntity } from './processing.entity';
import { UserEntity } from './users.entity';
import { EnvironmentEntity } from './environment.entity';

@Entity()
export class ConsignmentEntity extends BaseEntity implements Consignment {
  @PrimaryColumn()
  shipmentId: string;

  @PrimaryColumn()
  batchId: string;

  @Column()
  @IsNotEmpty()
  storagePlantId: number;

  @Column()
  @IsNotEmpty()
  carrier: string;

  @Column()
  @IsNotEmpty()
  status: string;

  @Column({ nullable: true })
  blockchainHash: string;

  @Column()
  @IsNotEmpty()
  // Automatically sets the column to the current date when a new record is created
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @IsNotEmpty()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsNotEmpty()
  departureDate: Date;

  @Column()
  @IsNotEmpty()
  expectedArrivalDate: Date;

  @OneToMany(() => ProcessingEntity, processing => processing.batchId)
  processing: ProcessingEntity;

  // many consignments can be fulfilled by 1 user
  @ManyToOne(() => UserEntity, user => user.consignment)
  @JoinColumn({ name: 'storagePlantId', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToOne(() => EnvironmentEntity, environment => environment.consignment)
  environment: EnvironmentEntity;
}
