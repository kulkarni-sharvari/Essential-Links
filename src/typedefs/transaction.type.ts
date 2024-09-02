import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Transaction {
  @Field()
  messageId: string;

  @Field()
  userId: number;

  @Field()
  status: string;

}
