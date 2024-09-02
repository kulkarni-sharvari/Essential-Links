import { Transaction } from "@/typedefs/transaction.type";
import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
// the class will have fields that partially match the `User` type, though they are optional in the context of `Partial<User>`
export class TransactionDto implements Partial<Transaction> {

  @Field()
  @IsString()
  @IsNotEmpty()
  messageId: string;

}