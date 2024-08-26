import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Processing {

  @Field()
  harvestId: string;

  @Field()
  packagingPlantId: number;

  @Field()
  processType: string;

  @Field({nullable: true})
  batchId?: string;

  @Field({nullable: true})
  noOfPackets?: number;

  @Field({nullable: true})
  packetWeight?: string;

}
