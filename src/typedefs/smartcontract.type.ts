import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SmartContractTxResponse {
  @Field()
  txHash: String;
  @Field()
  message: String;
  @Field()
  statusCode: number;

}
