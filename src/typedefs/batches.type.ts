import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Batches {

  @Field()
  batchId: string;

  @Field()
  packetWeight: string;

  @Field(() => [String])
  packages: string[];

}