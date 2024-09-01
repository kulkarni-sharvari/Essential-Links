import { TransactionEntity } from '@/entities/transaction.entity';
import { UserEntity } from '@/entities/users.entity';
import { WalletEntity } from '@/entities/wallet.entity';
import { logger } from '@/utils/logger';
import { TeaSupplyChain } from './teaSupplyChain.service';
import { GetWalletInfo } from '@/utils/getWalletInfo';
import uniqid from 'uniqid';
import { getConnection, QueryRunner } from 'typeorm';

const tsc = new TeaSupplyChain().getInstance();
class TransactionHandler {
  private async getQueryRunner(): Promise<QueryRunner> {
    const connection = getConnection(); // Ensure the connection is established
    return connection.createQueryRunner();
  }

  public async handleTransaction(tx: any): Promise<any> {
    let queryRunner: QueryRunner | null = null;
    try {
      queryRunner = await this.getQueryRunner();
      switch (tx.methodName) {
        case 'registerUser':
          return await this.handleUserRegistration(tx, queryRunner);
        case 'recordHarvest':
          return await this.handleRecordHarvest(tx, queryRunner);

        default:
          throw new Error(`Unsupported transaction method: ${tx.methodName}`);
      }
    } catch (error) {
      logger.error(`Error handling transaction: ${error.message}`);
      throw error;
    } finally {
      if (queryRunner) {
        await queryRunner.release();
      }
    }
  }

  private async handleUserRegistration(tx: any, queryRunner: QueryRunner): Promise<void> {
    const requestId: string = tx.requestId;
    const userId: number = tx.userId;
    let txHash: string = 'N.A';

    try {
      const [accountAddress, userId, role] = tx.payload;
      txHash = await tsc.registerUser(accountAddress, userId, role);

      await queryRunner.startTransaction();
      await this.updateTransactionStatus(requestId, 'COMPLETED', txHash, 'N.A', queryRunner);
      await queryRunner.commitTransaction();
    } catch (error) {
      await this.handleFailedTransaction(requestId, userId, txHash, error, queryRunner);
    }
  }

  private async handleRecordHarvest(tx: any, queryRunner: QueryRunner): Promise<void> {
    const requestId: string = tx.requestId;
    const userId: number = tx.userId;
    let txHash: string = 'N.A';

    try {
      const [harvestId, harvestDate, quality, quantity, location] = tx.payload;
      const privateKey = await this.getUserWalletDetails(tx.userId);
      txHash = await tsc.recordHarvest(harvestId, harvestDate, quality, quantity, location, privateKey);

      await queryRunner.startTransaction();
      await this.updateTransactionStatus(requestId, 'COMPLETED', txHash, 'N.A', queryRunner);
      await queryRunner.commitTransaction();

    } catch (error) {
      await this.handleFailedTransaction(requestId, userId, txHash, error, queryRunner);
    }
  }
  private async updateTransactionStatus(
    requestId: string,
    status: string,
    txHash: string,
    errorMessage: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.update(TransactionEntity, { requestId: requestId }, { status: status, txHash: txHash, errorMessage: errorMessage });
  }

  private async handleFailedTransaction(requestId: string, userId: number, txHash: string, error: Error, queryRunner: QueryRunner): Promise<void> {
    logger.error(`Transaction failed from handleFailedTransaction: ${error.message}`);

    try {
      await queryRunner.startTransaction();

      await this.updateTransactionStatus(requestId, 'FAILED', txHash, error.message.toString(), queryRunner);
      logger.info(`Updating the status of Request: ${requestId}`);

      await queryRunner.manager.delete(WalletEntity, { userId: userId });
      logger.info(`Deleted wallet for user ID: ${userId}`);

      await queryRunner.manager.delete(UserEntity, { id: userId });
      logger.info(`Deleted user details for user ID: ${userId}`);

      await queryRunner.commitTransaction();
    } catch (cleanupError) {
      logger.error(`Error during transaction cleanup: ${cleanupError.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  private async getUserWalletDetails(userId: number): Promise<string> {
    return (await new GetWalletInfo().createWalletFromId(userId)).privateKey;
  }

  public async addTxToDb(tx: any): Promise<string> {
    const requestId = uniqid();
    let queryRunner: QueryRunner | null = null;

    try {
      queryRunner = await this.getQueryRunner();
      await queryRunner.startTransaction();

      const res = await queryRunner.manager.save(TransactionEntity, {
        requestId: requestId,
        methodName: tx?.methodName,
        payload: tx?.payload.toString(),
        userId: tx?.userId,
        entityId: tx?.entityId,
        status: 'SUBMITTED',
      });
      logger.info(`Added tx to Transaction Table: ${JSON.stringify(res)}`);

      await queryRunner.commitTransaction();
      return res.requestId;
    } catch (error) {
      logger.error(`Error in addTxToDb: ${error.message}`);
      throw error;
    } finally {
      if (queryRunner) {
        await queryRunner.release();
      }
    }
  }
}

class Singleton {
  private static instance: TransactionHandler;

  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new TransactionHandler();
    }
  }

  public getInstance() {
    return Singleton.instance;
  }
}

export { Singleton as TransactionHandler };
