import { Environment } from "@/interfaces/environment.interface";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class EnvironmentEntity extends BaseEntity implements Environment {

  @PrimaryColumn()
  batchId: string;
  
  @PrimaryColumn()
  shipmentId: string;

  @Column()
  @IsNotEmpty()
  track: string;

  @Column()
  @IsNotEmpty()
  temperature: number;

  @Column()
  @IsNotEmpty()
  humidity: number;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;

}