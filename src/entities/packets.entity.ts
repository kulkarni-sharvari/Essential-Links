import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Packets } from "@/interfaces/packets.interface";


@Entity()
export class PacketsEntity extends BaseEntity implements Packets {
  @PrimaryColumn()
  packageId: string;

  @Column()
  @IsNotEmpty()
  batchId: string;

  @Column()
  @IsNotEmpty()
  weight: string;

  @Column({nullable: true})
  blockchainHash: string;

  @Column()
  // Automatically sets the column to the current date when a new record is created
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  // Automatically updates the column to the current date whenever the record is updated
  @UpdateDateColumn()
  updatedAt: Date;


}