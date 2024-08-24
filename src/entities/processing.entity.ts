// Imports various decorators and classes from `typeorm`
import { BaseEntity, Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
// This decorator ensures that a field is not empty.
import { IsNotEmpty } from 'class-validator';

import { Processing } from '@/interfaces/processing.interface';
@Entity()
export class ProcessingEntity extends BaseEntity implements Processing {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    @IsNotEmpty()
    harvestId: string;

    @Column()
    @IsNotEmpty()
    batchId: string;

    @Column()
    @IsNotEmpty()
    processType: string;

    @Column()
    @IsNotEmpty()
    packagingPlantId: number;

    @Column()
    // Automatically sets the column to the current date when a new record is created
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    // Automatically updates the column to the current date whenever the record is updated
    @UpdateDateColumn()
    updatedAt: Date;

}