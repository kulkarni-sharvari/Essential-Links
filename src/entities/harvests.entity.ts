import { TeaHarvests } from "@/interfaces/harvests.interface";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class TeaHarvestsEntity extends BaseEntity implements TeaHarvests {
  @PrimaryColumn()
  harvestId: string;

  @Column()
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

  @Column({nullable: true})
  blockchainHash: string;

  @Column()
  location: string;
}