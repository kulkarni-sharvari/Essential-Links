import { TransactionEntity } from '@/entities/transaction.entity';
import { UserEntity } from '@/entities/users.entity';
import { WalletEntity } from '@/entities/wallet.entity';
import { logger } from '@/utils/logger';
import { TeaSupplyChain } from './teaSupplyChain.service';
import { GetWalletInfo } from '@/utils/getWalletInfo';
import uniqid from 'uniqid';
import { getConnection, QueryRunner } from 'typeorm';
import { TeaHarvestsEntity } from '@/entities/harvests.entity';
import { ProcessingEntity } from '@/entities/processing.entity';
import { ConsignmentEntity } from '@/entities/consignment.entity';

// Singleton instance of TeaSupplyChain
const tsc = new TeaSupplyChain().getInstance();

/**
 * @title TransactionHandler
 * @description Handles various transaction methods related to user registration, harvest recording, and processing recording.
 */
class TransactionHandler {
  /**
   * @title handleTransaction
   * @description Main entry point for handling transactions. It delegates the transaction handling
   *              based on the method name provided in the transaction object.
   * @param tx - Transaction object containing methodName, payload, userId, requestId, etc.
   * @returns {Promise<any>} - Result of the transaction handling.
   * @throws {Error} - Throws an error if the transaction method is unsupported or if an error occurs during processing.
   */
  public async handleTransaction(tx: any): Promise<any> {
    try {
      switch (tx.methodName) {
        case 'registerUser':
          return await this.handleUserRegistration(tx);
        case 'recordHarvest':
          return await this.handleRecordHarvest(tx);
        case 'recordProcessing':
          return await this.handleRecordProcessing(tx);
        case 'createBatch':
          return await this.handleCreateBatch(tx);
        case 'createConsignment':
          return await this.handleCreateConsignment(tx);
        case 'updateConsignment':
          return await this.handleUpdateConsignment(tx);

        default:
          throw new Error(`Unsupported transaction method: ${tx.methodName}`);
      }
    } catch (error) {
      logger.error(`Error handling transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * @title handleUserRegistration
   * @description Handles user registration transactions. It registers a new user and updates the transaction status.
   *              In case of failure, it rolls back changes and deletes the associated user and wallet information.
   * @param tx - Transaction object containing user registration details.
   * @returns {Promise<void>} - Void
   * @throws {Error} - Throws an error if the registration fails or if database operations fail.
   */
  private async handleUserRegistration(tx: any): Promise<void> {
    const requestId: string = tx.requestId;
    const userId: number = tx.userId;
    const entityId = userId.toString();
    const queryRunner = getConnection().createQueryRunner();
    let txHash: string = 'N.A';

    try {
      const [accountAddress, _, userRole] = tx.payload;
      txHash = await tsc.registerUser(accountAddress, userId, userRole);

      await queryRunner.startTransaction();
      await queryRunner.manager.update(
        TransactionEntity,
        { requestId },
        {
          status: 'COMPLETED',
          txHash,
          errorMessage: 'N.A',
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await this.handleTransactionError(queryRunner, requestId, userId, error, 'UserRegistration', entityId);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @title handleRecordHarvest
   * @description Handles harvest recording transactions. It records harvest details on the blockchain and updates the transaction status.
   *              In case of failure, it rolls back changes and deletes the associated harvest record.
   * @param tx - Transaction object containing harvest details.
   * @returns {Promise<void>} - Void
   * @throws {Error} - Throws an error if the recording fails or if database operations fail.
   */
  private async handleRecordHarvest(tx: any): Promise<void> {
    const requestId: string = tx.requestId;
    const userId: number = tx.userId;
    const queryRunner = getConnection().createQueryRunner();
    let txHash: string = 'N.A';
    let entityId;

    try {
      const [harvestId, harvestDate, quality, quantity, location] = tx.payload;
      entityId = harvestId;
      const privateKey = await this.getUserWalletDetails(userId);
      txHash = await tsc.recordHarvest(harvestId, harvestDate, quality, quantity, location, privateKey);

      await queryRunner.startTransaction();
      await queryRunner.manager.update(
        TransactionEntity,
        { requestId },
        {
          status: 'COMPLETED',
          txHash,
          errorMessage: 'N.A',
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await this.handleTransactionError(queryRunner, requestId, userId, error, 'RecordHarvest', entityId);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @title handleRecordProcessing
   * @description Handles processing recording transactions. It records processing details on the blockchain and updates the transaction status.
   *              In case of failure, it updates the transaction status to failed but does not perform additional rollback.
   * @param tx - Transaction object containing processing details.
   * @returns {Promise<void>} - Void
   * @throws {Error} - Throws an error if the recording fails or if database operations fail.
   */
  private async handleRecordProcessing(tx: any): Promise<void> {
    const requestId: string = tx.requestId;
    const userId: number = tx.userId;
    const queryRunner = getConnection().createQueryRunner();
    let txHash: string = 'N.A';

    try {
      const [harvestId, processingStatus] = tx.payload;
      const privateKey = await this.getUserWalletDetails(userId);
      txHash = await tsc.recordProcessing(harvestId, processingStatus, privateKey);

      await queryRunner.startTransaction();
      await queryRunner.manager.update(
        TransactionEntity,
        { requestId },
        {
          status: 'COMPLETED',
          txHash,
          errorMessage: 'N.A',
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await this.handleTransactionError(queryRunner, requestId, userId, error, 'RecordProcessing');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @title handleCreateBatch
   * @description Handles processing recording transactions. It records processing details on the blockchain and updates the transaction status.
   *              In case of failure, it updates the transaction status to failed but does not perform additional rollback.
   * @param tx - Transaction object containing processing details.
   * @returns {Promise<void>} - Void
   * @throws {Error} - Throws an error if the recording fails or if database operations fail.
   */
  private async handleCreateBatch(tx: any): Promise<void> {
    const requestId: string = tx.requestId;
    const userId: number = tx.userId;
    const queryRunner = getConnection().createQueryRunner();
    let txHash: string = 'N.A';
    let entityId: string;

    try {
      const [harvestId, batchId, quantity, packetIds] = tx.payload;
      const privateKey = await this.getUserWalletDetails(userId);
      entityId = batchId;
      txHash = await tsc.createBatch(harvestId, batchId, quantity, packetIds, privateKey);

      await queryRunner.startTransaction();
      await queryRunner.manager.update(
        TransactionEntity,
        { requestId },
        {
          status: 'COMPLETED',
          txHash,
          errorMessage: 'N.A',
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await this.handleTransactionError(queryRunner, requestId, userId, error, 'CreateBatch', entityId);
      logger.error(`Error in handleCreateBatch ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @title handleCreateConsignment
   * @description Handles processing recording transactions. It records processing details on the blockchain and updates the transaction status.
   *              In case of failure, it updates the transaction status to failed but does not perform additional rollback.
   * @param tx - Transaction object containing processing details.
   * @returns {Promise<void>} - Void
   * @throws {Error} - Throws an error if the recording fails or if database operations fail.
   */
  private async handleCreateConsignment(tx: any): Promise<void> {
    const requestId: string = tx.requestId;
    const userId: number = tx.userId;
    const queryRunner = getConnection().createQueryRunner();
    let txHash: string = 'N.A';
    let entityId: string;

    try {
      const [consignmentId, batchIds, carrier, departureDate, eta] = tx.payload;
      const privateKey = await this.getUserWalletDetails(userId);
      entityId = consignmentId;
      txHash = await tsc.createConsignment(consignmentId, batchIds, carrier, departureDate, eta, privateKey);
      await queryRunner.startTransaction();
      await queryRunner.manager.update(
        TransactionEntity,
        { requestId },
        {
          status: 'COMPLETED',
          txHash,
          errorMessage: 'N.A',
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await this.handleTransactionError(queryRunner, requestId, userId, error, 'CreateConsignment', entityId);
      logger.error(`Error in handleCreateBatch ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @title handleUpdateConsignment
   * @description Handles processing recording transactions. It records processing details on the blockchain and updates the transaction status.
   *              In case of failure, it updates the transaction status to failed but does not perform additional rollback.
   * @param tx - Transaction object containing processing details.
   * @returns {Promise<void>} - Void
   * @throws {Error} - Throws an error if the recording fails or if database operations fail.
   */
  private async handleUpdateConsignment(tx: any): Promise<void> {
    const requestId: string = tx.requestId;
    const userId: number = tx.userId;
    const queryRunner = getConnection().createQueryRunner();
    let txHash: string = 'N.A';
    let entityId: string;

    try {
      const [consignmentId, temperature, humidity, track] = tx.payload;
      const privateKey = await this.getUserWalletDetails(userId);
      entityId = consignmentId;
      txHash = await tsc.updateConsignment(consignmentId, temperature, humidity, track, privateKey);
      await queryRunner.startTransaction();
      await queryRunner.manager.update(
        TransactionEntity,
        { requestId },
        {
          status: 'COMPLETED',
          txHash,
          errorMessage: 'N.A',
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await this.handleTransactionError(queryRunner, requestId, userId, error, 'UpdateConsignment', entityId);
      logger.error(`Error in handleCreateBatch ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @title handleTransactionError
   * @description Handles errors during transaction processing. It updates the transaction status to failed and performs necessary rollbacks.
   *              If needed, deletes associated records from the database.
   * @param queryRunner - QueryRunner instance to manage database transactions.
   * @param requestId - The ID of the transaction request.
   * @param userId - The ID of the user involved in the transaction.
   * @param error - The error that occurred during transaction processing.
   * @param context - The context or type of transaction that failed (e.g., 'UserRegistration').
   * @param entityId - Optional ID of the harvest, used only if the context is 'RecordHarvest'.
   * @returns {Promise<void>} - Void
   * @throws {Error} - Throws an error if the rollback fails.
   */
  private async handleTransactionError(
    queryRunner: QueryRunner,
    requestId: string,
    userId: number,
    error: Error,
    context: string,
    entityId?: string,
  ): Promise<void> {
    try {
      await queryRunner.startTransaction();
      await queryRunner.manager.update(
        TransactionEntity,
        { requestId },
        {
          status: 'FAILED',
          txHash: 'N.A',
          errorMessage: error.message,
        },
      );

      if (context === 'UserRegistration') {
        logger.info(`Deleting wallet and user details due to UserRegistration failure : ${userId}`);
        await queryRunner.manager.delete(WalletEntity, { userId });
        await queryRunner.manager.delete(UserEntity, { id: userId });
      } else if (context === 'RecordHarvest') {
        await queryRunner.manager.delete(TeaHarvestsEntity, { harvestId: entityId });
        logger.info(`Deleted Harvest ID due to RecordHarvest failure: ${entityId}`);
      } else if (context === 'CreateBatch') {
        logger.info(`Deleting Harvest ID due to CreateBatch failure: ${entityId}`);
        await queryRunner.manager.delete(ProcessingEntity, { harvestId: entityId });
        await queryRunner.manager.delete(TeaHarvestsEntity, { harvestId: entityId });
      } else if (context === 'CreateConsignment') {
        logger.info(`Deleting Coinsignment ID due to CreateConsignment failure: ${entityId}`);
        await queryRunner.manager.delete(ConsignmentEntity, { shipmentId: entityId });
      } else if (context === 'UpdateConsignment') {
        logger.info(`Deleting Coinsignment Update due to UpdateConsignment failure: ${entityId}`);
        // await queryRunner.manager.delete(EnvironmentEntity, { shipmentId: entityId });
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      logger.error(`Error handling transaction error in ${context}: ${err.message}`);
      await queryRunner.rollbackTransaction();
    }
  }

  /**
   * @title getUserWalletDetails
   * @description Fetches the user's wallet details including the private key.
   * @param userId - The ID of the user whose wallet details are to be fetched.
   * @returns {Promise<string>} - The private key of the user's wallet.
   */
  private async getUserWalletDetails(userId: number): Promise<string> {
    return (await new GetWalletInfo().createWalletFromId(userId)).privateKey;
  }

  /**
   * @title addTxToDb
   * @description Adds a new transaction record to the database. Generates a unique request ID and saves transaction details.
   * @param tx - Transaction object containing methodName, payload, userId, and entityId.
   * @returns {Promise<string>} - The generated request ID for the transaction.
   * @throws {Error} - Throws an error if database operations fail.
   */
  public async addTxToDb(tx: any): Promise<string> {
    const requestId = uniqid();
    const queryRunner = getConnection().createQueryRunner();

    try {
      await queryRunner.startTransaction();
      const res = await queryRunner.manager.save(TransactionEntity, {
        requestId,
        methodName: tx?.methodName,
        payload: tx?.payload.toString(),
        userId: tx?.userId,
        entityId: tx?.entityId,
        status: 'SUBMITTED',
      });
      logger.info(`Added transaction to Transaction Table: ${JSON.stringify(res)}`);
      await queryRunner.commitTransaction();
      return res.requestId;
    } catch (error) {
      logger.error(`Error adding transaction to database: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

/**
 * @title Singleton
 * @description Singleton pattern implementation for the TransactionHandler class to ensure a single instance.
 */
class Singleton {
  private static instance: TransactionHandler;

  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new TransactionHandler();
    }
  }

  /**
   * @title getInstance
   * @description Returns the singleton instance of TransactionHandler.
   * @returns {TransactionHandler} - The singleton instance of TransactionHandler.
   */
  public getInstance() {
    return Singleton.instance;
  }
}

export { Singleton as TransactionHandler };
