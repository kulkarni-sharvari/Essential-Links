import { Field, ObjectType } from 'type-graphql';
import { User } from './users.type';
import { TeaHarvests } from './teaHarvests.type';
import { Transaction } from './transaction.type';
import { Processing } from './processing.type';
import { Batches } from './batches.type';
import { ConsignmentOutput } from './consignment.type';
import { Environment } from './environment.type';

@ObjectType()
export class RequestStatusResultUnion {
  @Field(() => Transaction, { nullable: true })
  transactionDetails?: Transaction;

  @Field(() => User, { nullable: true })
  userDetails?: User;

  @Field(() => TeaHarvests, { nullable: true })
  harvestDetails?: TeaHarvests;

  @Field(() => Processing, { nullable: true })
  processingDetails?: Processing;
  
  @Field(() => [ConsignmentOutput], { nullable: true })
  consignmentDetails?: ConsignmentOutput[];

  @Field(() => Batches, { nullable: true })
  batchDetails?: Batches;

  @Field(() => Environment, { nullable: true })
  environmentDetails?: Environment;

  constructor(data?: Partial<RequestStatusResultUnion>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
