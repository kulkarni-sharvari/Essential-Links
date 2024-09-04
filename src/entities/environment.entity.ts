import { Environment } from '@/interfaces/environment.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ConsignmentEntity } from './consignment.entity';

@Entity()
export class EnvironmentEntity extends BaseEntity implements Environment {

  @PrimaryColumn()
  shipmentId: string;

  @Column()
  @IsNotEmpty()
  track: string;

  @Column()
  @IsNotEmpty()
  temperature: string;

  @Column()
  @IsNotEmpty()
  humidity: string;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ConsignmentEntity, cosignment => cosignment.environment)
  consignment: ConsignmentEntity;
}
