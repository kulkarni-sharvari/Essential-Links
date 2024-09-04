import { HTTP_STATUS_CODE } from "@/constants";
import { TransactionEntity } from "@/entities/transaction.entity";
import { DBException } from "@/exceptions/DBException";
import { Transaction } from "@/interfaces/transaction.interface";
import { EntityRepository } from "typeorm";

@EntityRepository(TransactionEntity)
// A class that handles various user-related database operations
export class TransactionRepository {
    public async readTransactionById(messageId): Promise<Transaction[]> {
        try {
            const txn: Transaction[] = await TransactionEntity.find({ where: { messageId } });
            if(txn.length === 0) throw new DBException(HTTP_STATUS_CODE.NOT_FOUND, "No Records")
            return txn;
        } catch (error) {
            throw new DBException(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, error.message)
        }
    }
}