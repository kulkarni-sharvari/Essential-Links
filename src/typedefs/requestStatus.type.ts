import { Field, ObjectType } from 'type-graphql';
import { User } from './users.type';
import { TeaHarvests } from './teaHarvests.type';
import { Transaction } from './transaction.type';

@ObjectType()
export class RequestStatusResultUnion {
  @Field(() => Transaction, { nullable: true })
  transactionDetails?: Transaction;

  @Field(() => User, { nullable: true })
  userDetails?: User;

  @Field(() => TeaHarvests, { nullable: true })
  harvestDetails?: TeaHarvests;

  constructor(data?: Partial<RequestStatusResultUnion>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
