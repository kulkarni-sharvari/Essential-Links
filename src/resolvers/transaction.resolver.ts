import { TransactionRepository } from "@/repositories/transaction.repository";
import { Transaction } from "@/typedefs/transaction.type";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class TransactionResolver extends TransactionRepository {
    /**
     * @param messageId
     * @returns all transaction details for that messageId
     */
    // @Authorized([USER_ROLE.FARMER, USER_ROLE.PROCESSING_PLANT, USER_ROLE.SHIPMENT_COMPANY])
    @Query(() => Transaction, { description: 'Get Transaction details for messageId' })
    async getTransactionById(@Arg('messageId') messageId: string): Promise<Transaction[]> {
        const transaction = await this.readTransactionById(messageId);
        return transaction;
    }
}