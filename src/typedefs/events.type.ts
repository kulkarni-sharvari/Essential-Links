import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Events {

 @Field()
  id?: number;

  @Field()
  eventDetails: object;

  @Field()
  eventName: string;

  @Field()
  blockchainHash: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

}