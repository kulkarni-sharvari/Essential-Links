import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class HarvestDetails {  // Export the class
  @Field()
  harvestId: string;

  @Field()
  date: string;

  @Field()
  quality: string;

  @Field()
  quantity: string;

  @Field()
  location: string;

  @Field()
  farmerId: string;

  @Field()
  timestamp: string;
}

@ObjectType()
class BatchDetails {  // Export the class
  @Field()
  batchId: string;

  @Field()
  harvestId: string;

  @Field()
  packetQuantity: string;

  @Field(() => [String])
  packetIds: string[];
}

@ObjectType()
class ConsignmentDetails {  // Export the class
  @Field()
  consignmentId: string;

  @Field(() => [String])
  batchIds: string[];

  @Field()
  carrier: string;

  @Field()
  departureDate: string;

  @Field()
  eta: string;

  @Field()
  timestamp: string;

  @Field()
  otherDetails: OtherDetails;
}

@ObjectType()
class OtherDetails {  // Export the class
  @Field()
  temperature: string;

  @Field()
  humidity: string;

  @Field()
  status: string;  // Fixed typo from 'satus' to 'status'

  @Field()
  timestamp: string;
}

@ObjectType()
export class PacketHistory {  // Export the class
  @Field()
  harvestDetails: HarvestDetails;

  @Field()
  batchDetails: BatchDetails;

  @Field()
  consignmentDetails: ConsignmentDetails;
}
