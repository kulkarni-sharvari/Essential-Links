import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  @Field()
  id?: number;

  @Field()
  email?: string;

  @Field()
  role: string;

  @Field()
  location: string;

  @Field()
  walletAddress: string;
}
