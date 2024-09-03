import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Transaction {
  @Field()
  requestId?: string;

  @Field()
  methodName?: string;

  @Field()
  payload?: string;

  @Field()
  userId?: number;

  @Field()
  entityId?: string;

  @Field()
  status?: string;

  @Field({ nullable: true })
  txHash?: string;

  @Field({ nullable: true })
  errorMessage?: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
