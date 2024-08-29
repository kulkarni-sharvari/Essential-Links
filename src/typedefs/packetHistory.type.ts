import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class HarvestDetails {
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
class BatchDetails {
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
class OtherDetails {
  @Field()
  temperature: string;

  @Field()
  humidity: string;

  @Field()
  status: string;

  @Field()
  timestamp: string;
}

@ObjectType()
class ConsignmentDetails {
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

  @Field(() => OtherDetails)
  otherDetails: OtherDetails;
}

@ObjectType()
export class PacketHistory {
  @Field(() => HarvestDetails)
  harvestDetails: HarvestDetails;

  @Field(() => BatchDetails)
  batchDetails: BatchDetails;

  @Field(() => ConsignmentDetails)
  consignmentDetails: ConsignmentDetails;
}
