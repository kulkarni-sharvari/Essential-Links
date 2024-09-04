import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TeaHarvests {
  @Field()
  harvestId: string;

  @Field()
  userId?: number;

  @Field()
  quantity?: number;

  @Field()
  quality: string;

  @Field()
  createdAt: Date;

  @Field({nullable: true})
  blockchainHash?: string;

  @Field()
  location?: string;
}
