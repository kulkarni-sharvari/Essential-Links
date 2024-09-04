import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

interface eventDetails {
  batchId?: string;
  shipmentId?: string;
  carrier?: string;
  departureDate?: string;
  eta?: string;
  temperature?: string;
  humidity?: string;
  status?: string;
  date?: string;
  location?: string;
  farmerId?: string;
  accountAddress?: string;
  role?: string;
  harvestId?: string;
  quantity?: string;
  quality?:string;
  timestamp?: string;
}

@Entity()
export class EventEntity extends BaseEntity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  //eventDetails: object;
  eventDetails: eventDetails;

  @Column({ type: 'varchar', length: 255 })
  eventName: string;

  @Column({ type: 'varchar', length: 255 })
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