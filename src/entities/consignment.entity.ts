import { Consignment } from "@/interfaces/consignment.interface";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ProcessingEntity } from "./processing.entity";

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

    @Column()
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

    @OneToMany(() => ProcessingEntity, (processing) => processing.batchId)
    processing: ProcessingEntity
}