import { CreateBatchDto, CreateProcessingDto } from '@/dtos/processing.dto';
import { PacketsEntity } from '@/entities/packets.entity';
import { ProcessingEntity } from '@/entities/processing.entity';
import { DBException } from '@/exceptions/DBException';
import { Processing } from '@/interfaces/processing.interface';
import { Batches } from '@/typedefs/batches.type';
import { Packets } from '@/typedefs/packets.type';
import { logger } from '@/utils/logger';
import { EntityRepository } from 'typeorm';
import uniqid from 'uniqid';
import { Publisher } from '@/services/publisher.service';
const publisher = new Publisher().getInstance();

@EntityRepository(ProcessingEntity)
export class ProcessingRepository {
  /**
   * Creates a record in the database for processing.
   * @param processingInput - The processing input data.
   * @param userWallet - The wallet of the user making the request.
   * @returns The created processing record.
   */
  public async processingCreate(processingInput: CreateProcessingDto, userId: number): Promise<any> {
    try {
      const createProcessingData: ProcessingEntity = await ProcessingEntity.create({ ...processingInput, packagingPlantId: userId }).save();

      // Save the processing data in the database
      const payload = [processingInput.harvestId, processingInput.processType];
      const tx = {
        methodName: 'recordProcessing',
        payload: payload,
        userId: userId,
        entityId: processingInput.harvestId,
      };
      return await publisher.publish(tx);
    } catch (error) {
      logger.error('Error in processingCreate method:', error);
      // throw new DBException(500, error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves processing records by harvest ID.
   * @param harvestId - The ID of the harvest.
   * @returns A list of processing records for the given harvest ID.
   */
  public async getProcessingDetailsByHarvestId(harvestId: string): Promise<Processing[]> {
    try {
      const processingDetails = await ProcessingEntity.find({ where: { harvestId } });
      return processingDetails;
    } catch (error) {
      logger.error(`Error retrieving processing details for harvestId: ${harvestId}`, error);
      throw new DBException(500, error.message);
    }
  }

  /**
   * Creates a batch and associated packets in the database.
   * @param batchInput - The input data for creating a batch.
   * @param userWallet - The wallet of the user making the request.
   * @returns The created batch information.
   */
  public async batchCreate(batchInput: CreateBatchDto, userId: number): Promise<Batches> {
    batchInput['packetWeight'] = '50g';

    logger.info('Creating batchId');
    const batchId = uniqid();

    logger.info('Creating packets');
    const packages: Partial<Packets>[] = [];
    for (let i = 0; i < batchInput.noOfPackets; i++) {
      const packageId = uniqid();
      packages.push({ batchId, packageId, weight: batchInput.packetWeight });
    }

    try {
      // Bulk insert into the packets table
      await PacketsEntity.createQueryBuilder().insert().into(PacketsEntity).values(packages).execute();
      logger.info('Created packets successfully');

      // Update the processing entity with batch details
      await ProcessingEntity.createQueryBuilder()
        .update(ProcessingEntity)
        .where({ harvestId: batchInput.harvestId })
        .set({ batchId, noOfPackets: batchInput.noOfPackets })
        .execute();
      logger.info('Updated processing with batch details successfully');

      const batch: Batches = {
        batchId,
        packetWeight: batchInput.packetWeight,
        packages: packages.map(({ packageId }) => packageId as string),
      };

      const payload = [batchId, batchInput.harvestId, batchInput.noOfPackets.toString(), batch.packages];
      const tx = {
        methodName: 'createBatch',
        payload: payload,
        userId: userId,
        entityId: batchId,
      };
      return await publisher.publish(tx);

    } catch (error) {
      logger.error('Error in batchCreate method:', error);
      throw new DBException(500, error.message);
    }
  }
}
